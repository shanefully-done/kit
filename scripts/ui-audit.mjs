#!/usr/bin/env node
/**
 * Deterministic UI bug audit for Kit.
 *
 * Serves nothing itself; drives a production `next start` server with
 * headless Chrome and counts unique, reproducible UI bug signatures across
 * every tool route. Three passes:
 *
 *  1. Desktop realistic sweep (1440x900) in a clean incognito context
 *     (clipboard resolves by default in headless Chrome): trusted CDP mouse
 *     clicks on every visible button in <main>, real keyboard typing into
 *     the first textarea/text input. Catches runtime, state, popover, and
 *     interaction bugs on success paths.
 *  2. Desktop hostile-clipboard sweep: context with an (empirically
 *     denying) clipboard permission override and untrusted programmatic
 *     clicks, so every navigator.clipboard.writeText() rejects. Any tool
 *     calling it without a rejection handler produces an uncaught promise
 *     rejection -> counted as a bug. Tools that catch the failure and
 *     log/toast it are NOT counted (handled); their console messages are
 *     filtered by an explicit, narrow rule.
 *  3. Mobile pass (390x844): load-only; catches hydration errors and
 *     document/main horizontal overflow.
 *
 * Plus a static nav-consistency audit: filesystem routes vs sidebar hrefs vs
 * homepage hrefs (components/ui/sidebar.tsx, app/page.tsx).
 *
 *  4. Upload pass: deterministic fixtures (1x1 PNG/JPEG, QR PNG from the
 *     pinned qrcode dep) are uploaded to the file-gated tools (qr-code
 *     decode, image metadata, base64 image) followed by a click sweep —
 *     exercising FileReader/EXIF/jsqr paths no other pass reaches.
 *  5. Korean + dark pass: seeds devkit:locale="ko" and theme="dark" via
 *     localStorage, then interactively sweeps every route — exercising ko
 *     dictionary paths and dark-mode rendering, asserting per route that
 *     html.dark is present and documentElement.lang === "ko".
 *
 * Determinism: fixed route order, fixed locale/timezone/reduced-motion,
 * fixed sample inputs, fixed click budget, localhost-only network.
 *
 * Prints "METRIC <name>=<value>" lines on stdout. Exit 0 when the audit
 * completed (findings are data, not failure); exit 1 on infrastructure
 * failure (no browser, unreadable sources).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import QRCode from "qrcode";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATEGORIES = ["converters-parsers", "generators", "viewers-miscellaneous"];

const SAMPLE_TEXTAREA = '{"name":"Ada","n":42,"ok":true}';
const SAMPLE_INPUT = "hello world";
const CLICK_BUDGET = 18;
const NAV_TIMEOUT_MS = 20_000;
const SETTLE_MS = 250;
// Handled clipboard failures: tool caught the rejection and logged it.
// Narrow filter — message must mention both the clipboard API failure and
// a copy action. Never matches arbitrary errors.
function isHandledClipboardLog(msg) {
	return /NotAllowedError/i.test(msg) && /(copy|clipboard)/i.test(msg);
}


// Deterministic upload fixtures, regenerated into a temp dir each run from
// fixed inputs (qrcode version pinned by the lockfile -> byte-identical).
const FIXTURE_DIR = path.join(os.tmpdir(), "kit-audit-fixtures");
const UPLOADS = [
	{ route: "/generators/qr-code", fixture: "qr.png" },
	{ route: "/viewers-miscellaneous/image-metadata-viewer", fixture: "pixel.jpg" },
	{ route: "/converters-parsers/base64-image-converter", fixture: "pixel.png" },
];

async function makeFixtures() {
	await fs.promises.mkdir(FIXTURE_DIR, { recursive: true });
	// Minimal 1x1 images (transparent PNG / grayscale JPEG).
	await fs.promises.writeFile(
		path.join(FIXTURE_DIR, "pixel.png"),
		Buffer.from(
			"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
			"base64",
		),
	);
	await fs.promises.writeFile(
		path.join(FIXTURE_DIR, "pixel.jpg"),
		Buffer.from(
			"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwcJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPDIzNP/AABEIAAEAAQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/aAAwDAQACEQMRAD8A/v4ooooA/9k=",
			"base64",
		),
	);
	// QR PNG with a fixed payload — exercises the jsqr decode path.
	await QRCode.toFile(path.join(FIXTURE_DIR, "qr.png"), "KIT-AUDIT-QR-PAYLOAD", {
		type: "png",
		width: 256,
		margin: 2,
		errorCorrectionLevel: "M",
	});
}

// ---------------------------------------------------------------- args

const args = process.argv.slice(2);
function argValue(flag) {
	const i = args.indexOf(flag);
	return i >= 0 ? args[i + 1] : undefined;
}
const BASE = (argValue("--base") ?? "http://127.0.0.1:4199").replace(/\/$/, "");
const ORIGIN = new URL(BASE).origin;

// ---------------------------------------------------------------- static

function filesystemRoutes() {
	const routes = [];
	for (const cat of CATEGORIES) {
		const dir = path.join(ROOT, "app", cat);
		if (!fs.existsSync(dir)) continue;
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			if (entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, "page.tsx"))) {
				routes.push(`/${cat}/${entry.name}`);
			}
		}
	}
	return routes.sort();
}

function hrefsIn(file) {
	const src = fs.readFileSync(path.join(ROOT, file), "utf8");
	const hrefs = [];
	for (const m of src.matchAll(/href:\s*"([^"]+)"/g)) hrefs.push(m[1]);
	return hrefs;
}

function staticNavAudit(routes) {
	const findings = [];
	const sidebar = hrefsIn(path.join("components", "ui", "sidebar.tsx"));
	const home = hrefsIn(path.join("app", "page.tsx"));
	const toolLike = (h) => CATEGORIES.some((c) => h.startsWith(`/${c}/`));

	for (const route of routes) {
		if (!sidebar.includes(route))
			findings.push({ kind: "nav", detail: `route missing from sidebar: ${route}` });
		if (!home.includes(route))
			findings.push({ kind: "nav", detail: `route missing from homepage: ${route}` });
	}
	for (const h of sidebar.filter(toolLike)) {
		if (!routes.includes(h))
			findings.push({ kind: "nav", detail: `sidebar href has no route: ${h}` });
	}
	for (const h of home.filter(toolLike)) {
		if (!routes.includes(h))
			findings.push({ kind: "nav", detail: `homepage href has no route: ${h}` });
	}
	return findings;
}

// ---------------------------------------------------------------- helpers

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, 300);

function executablePath() {
	if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH))
		return process.env.CHROME_PATH;
	const candidates = [
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
		"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
		"/Applications/Chromium.app/Contents/MacOS/Chromium",
	];
	for (const c of candidates) if (fs.existsSync(c)) return c;
	throw new Error("no Chromium executable found; set CHROME_PATH");
}

/** Attach collectors that fill `cur.record` while it is non-null. */
function makeCollectors(page, cur) {
	page.on("dialog", (d) => d.dismiss().catch(() => {}));
	page.on("popup", (p) => p.close().catch(() => {}));
	page.on("console", (m) => {
		if (m.type() !== "error" || !cur.record) return;
		const text = norm(m.text());
		if (isHandledClipboardLog(text)) return; // handled failure, logged: not a bug
		cur.record.consoleErrors.add(text);
	});
	page.on("pageerror", (e) => {
		if (cur.record) cur.record.pageErrors.add(norm(e?.message ?? String(e)));
	});
	page.on("response", (r) => {
		if (
			cur.record &&
			r.status() >= 400 &&
			r.url().startsWith(ORIGIN) &&
			r.request().resourceType() === "document"
		)
			cur.record.docHttpError = true;
	});
	page.on("requestfailed", (r) => {
		if (
			cur.record &&
			r.resourceType() === "document" &&
			r.failure()?.errorText !== "net::ERR_ABORTED"
		)
			cur.record.docNetError = true;
	});
}

const newRecord = () => ({
	consoleErrors: new Set(),
	pageErrors: new Set(),
	docHttpError: false,
	docNetError: false,
	timedOut: false,
	overlay: false,
});

function flush(audit, route, rec) {
	for (const m of rec.consoleErrors) {
		const sig = `console|${route}|${m}`;
		if (!audit.signatures.has(sig)) {
			audit.signatures.add(sig);
			audit.findings.push({ kind: "console", route, detail: m });
		}
	}
	for (const m of rec.pageErrors) {
		const sig = `pageerror|${route}|${m}`;
		if (!audit.signatures.has(sig)) {
			audit.signatures.add(sig);
			audit.findings.push({ kind: "pageerror", route, detail: m });
		}
	}
	if (rec.timedOut || rec.docHttpError || rec.docNetError) {
		const sig = `failed|${route}`;
		if (!audit.signatures.has(sig)) {
			audit.signatures.add(sig);
			const why = rec.timedOut
				? "navigation timeout"
				: rec.docHttpError
					? "document HTTP >= 400"
					: "document request failed";
			audit.findings.push({ kind: "failed-route", route, detail: why });
		}
	}
	if (rec.overlay) {
		const sig = `overlay|${route}`;
		if (!audit.signatures.has(sig)) {
			audit.signatures.add(sig);
			audit.findings.push({
				kind: "overlay",
				route,
				detail: "error overlay / application error",
			});
		}
	}
}

async function loadRoute(page, route) {
	try {
		await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT_MS });
		return true;
	} catch (e) {
		console.error(
			`[audit] goto failed ${route}: ${e?.constructor?.name}: ${norm(e?.message)}`,
		);
		return false;
	}
}

async function hasOverlay(page) {
	return page
		.evaluate(() => {
			if (document.querySelector("nextjs-portal")) return true;
			return /application error/i.test(document.body?.innerText ?? "");
		})
		.catch(() => false);
}

/** Mark-and-skip helper injected in page: find next clickable button. */
const FIND_NEXT_BUTTON = () => {
	const visible = (el) => {
		const r = el.getBoundingClientRect();
		return r.width > 0 && r.height > 0;
	};
	const btn = [...document.querySelectorAll('main button:not([disabled])')].find(
		(b) => visible(b) && !b.dataset.auditClicked,
	);
	if (!btn) return null;
	btn.dataset.auditClicked = "1";
	const r = btn.getBoundingClientRect();
	return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

/**
 * Pass 1 interaction: trusted input. Type into first textarea + text input
 * with real keyboard events, then trusted-mouse-click every visible button
 * in <main> once. If a click navigates away (stray link under a moved
 * button), reload the route and continue.
 */
async function interactTrusted(page, route) {
	for (const selector of ["main textarea:not([disabled])", 'main input[type="text"]:not([disabled])']) {
		try {
			const el = await page.$(selector);
			if (!el) continue;
			await el.click({ delay: 20 });
			await page.keyboard.type(
				selector.includes("textarea") ? SAMPLE_TEXTAREA : SAMPLE_INPUT,
				{ delay: 0 },
			);
		} catch {
			/* element may be readonly/hidden; skip */
		}
	}

	for (let i = 0; i < CLICK_BUDGET; i++) {
		const target = await page.evaluate(FIND_NEXT_BUTTON).catch(() => null);
		if (!target) break;
		if (target.x <= 0 || target.y <= 0) continue;
		await page.mouse.click(target.x, target.y).catch(() => {});
		await sleep(120);
		const url = page.url();
		if (!url.startsWith(ORIGIN) || url.slice(ORIGIN.length) !== route) {
			// stray navigation (link under a shifted button): recover
			await loadRoute(page, route);
		}
	}
}

/** Fill first textarea + text input via native setters (no user activation). */
async function typeIntoFields(page) {
	await page
		.evaluate(
			(sampleTa, sampleInput) => {
				const setNativeValue = (el, value) => {
					const proto =
						el instanceof HTMLTextAreaElement
							? HTMLTextAreaElement.prototype
							: HTMLInputElement.prototype;
					const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
					if (!setter) return;
					setter.call(el, value);
					el.dispatchEvent(new Event("input", { bubbles: true }));
				};
				const visible = (el) => {
					const r = el.getBoundingClientRect();
					return r.width > 0 && r.height > 0;
				};
				const ta = [...document.querySelectorAll("main textarea:not([disabled])")].find(visible);
				if (ta) setNativeValue(ta, sampleTa);
				const ti = [
					...document.querySelectorAll('main input[type="text"]:not([disabled])'),
				].find(visible);
				if (ti) setNativeValue(ti, sampleInput);
			},
			SAMPLE_TEXTAREA,
			SAMPLE_INPUT,
		)
		.catch(() => {});
}

/** Pass 2 interaction: untrusted clicks (no user activation) so clipboard
 *  writeText always rejects; unhandled rejections surface as pageerror. */
async function interactUntrusted(page) {
	await typeIntoFields(page);
	for (let i = 0; i < CLICK_BUDGET; i++) {
		const clicked = await page
			.evaluate(() => {
				const visible = (el) => {
					const r = el.getBoundingClientRect();
					return r.width > 0 && r.height > 0;
				};
				const btn = [
					...document.querySelectorAll('main button:not([disabled])'),
				].find((b) => visible(b) && !b.dataset.auditClicked);
				if (!btn) return false;
				btn.dataset.auditClicked = "1";
				btn.click();
				return true;
			})
			.catch(() => false);
		if (!clicked) break;
		await sleep(120);
	}
}

// ---------------------------------------------------------------- browser

async function browserAudit(routes) {
	const browser = await puppeteer.launch({
		executablePath: executablePath(),
		headless: true,
		args: [
			"--no-first-run",
			"--no-default-browser-check",
			"--disable-dev-shm-usage",
			"--mute-audio",
		],
		reducedMotion: "reduce",
		locale: "en-US",
		timezoneId: "UTC",
		protocolTimeout: 120_000,
	});
	try {
		const audit = {
			findings: [],
			signatures: new Set(),
			overflowRoutes: new Set(),
		};

	// ---- pass 1: realistic desktop sweep (clean context, clipboard resolves) ----
	const friendly = await browser.createBrowserContext();
		const f1 = { record: null };
		const f1page = await friendly.newPage();
		await f1page.setViewport({ width: 1440, height: 900 });
		makeCollectors(f1page, f1);

		for (const route of routes) {
			f1.record = newRecord();
			if (await loadRoute(f1page, route)) {
				await sleep(SETTLE_MS);
				f1.record.overlay = await hasOverlay(f1page);
				await interactTrusted(f1page, route);
				await sleep(SETTLE_MS);
			} else {
				f1.record.timedOut = true;
			}
			flush(audit, route, f1.record);
			f1.record = null;
		}
		await f1page.close();

		// ---- pass 2: hostile clipboard, untrusted clicks ----
	// Empirically (headless Chrome 151): overridePermissions with these names
	// leaves clipboard-write DENIED ("clipboard-write" is not a valid grantable
	// permission name), so every navigator.clipboard.writeText rejects with
	// NotAllowedError — deterministic hostile-clipboard environment.
	const hostile = browser.defaultBrowserContext();
	await hostile.overridePermissions(ORIGIN, ["clipboard-read", "clipboard-write"]);
		const f2 = { record: null };
		const f2page = await hostile.newPage();
		await f2page.setViewport({ width: 1440, height: 900 });
		makeCollectors(f2page, f2);

		for (const route of routes) {
			f2.record = newRecord();
			if (await loadRoute(f2page, route)) {
				await sleep(SETTLE_MS);
				await interactUntrusted(f2page);
				await sleep(SETTLE_MS);
			} else {
				f2.record.timedOut = true;
			}
			flush(audit, route, f2.record);
			f2.record = null;
		}
		await f2page.close();

		// ---- pass 3: mobile load-only (hydration + overflow) ----
		const f3 = { record: null };
		const f3page = await friendly.newPage();
		await f3page.setViewport({
			width: 390,
			height: 844,
			isMobile: true,
			hasTouch: true,
			deviceScaleFactor: 2,
		});
		makeCollectors(f3page, f3);

		for (const route of routes) {
			f3.record = newRecord();
			if (await loadRoute(f3page, route)) {
				await sleep(SETTLE_MS);
				const overflowPx = await f3page
					.evaluate(() => {
						const de = document.documentElement;
						const main = document.querySelector("main");
						return Math.max(
							de.scrollWidth - de.clientWidth,
							main ? main.scrollWidth - main.clientWidth : 0,
						);
					})
					.catch(() => 0);
				if (overflowPx > 1) {
					const sig = `overflow|${route}`;
					if (!audit.signatures.has(sig)) {
						audit.signatures.add(sig);
						audit.overflowRoutes.add(route);
						audit.findings.push({
							kind: "overflow",
							route,
							detail: `horizontal overflow ${overflowPx}px at 390px viewport`,
						});
					}
				}
			} else {
				f3.record.timedOut = true;
			}
			flush(audit, route, f3.record);
			f3.record = null;
		}
		await f3page.close();

		// ---- pass 4: upload-gated tools (file decode/parse paths) ----
		// These tools' real logic only runs after a file lands; without this
		// pass their FileReader/EXIF/jsqr code is never exercised.
		let uploadRoutes = 0;
		const f4 = { record: null };
		const f4page = await friendly.newPage();
		await f4page.setViewport({ width: 1440, height: 900 });
		makeCollectors(f4page, f4);

		for (const { route, fixture } of UPLOADS) {
			f4.record = newRecord();
			if (await loadRoute(f4page, route)) {
				await sleep(SETTLE_MS);
				const fileInput = await f4page.$("input[type=file]");
				if (fileInput) {
					await fileInput.uploadFile(path.join(FIXTURE_DIR, fixture)).catch(() => {});
					await sleep(750); // FileReader + image decode settle
					f4.record.overlay = await hasOverlay(f4page);
					await interactTrusted(f4page, route);
					await sleep(SETTLE_MS);
					uploadRoutes += 1;
				} else {
					f4.record.consoleErrors.add("no file input found for upload pass");
				}
			} else {
				f4.record.timedOut = true;
			}
			flush(audit, route, f4.record);
			f4.record = null;
		}
		await f4page.close();

		// ---- pass 5: Korean locale + dark theme, interactive ----
		// Exercises ko dictionary paths and dark-mode rendering, which no
		// other pass reaches, and asserts both actually apply per route.
		let koDarkRoutes = 0;
		const f5 = { record: null };
		const f5page = await friendly.newPage();
		await f5page.setViewport({ width: 1440, height: 900 });
		makeCollectors(f5page, f5);

		// Seed preferences (same-origin storage; shared across the context).
		if (await loadRoute(f5page, "/")) {
			await f5page.evaluate(() => {
				localStorage.setItem("devkit:locale", JSON.stringify("ko"));
				localStorage.setItem("theme", "dark");
			});
		}
		for (const route of routes) {
			f5.record = newRecord();
			if (await loadRoute(f5page, route)) {
				await sleep(SETTLE_MS);
				const applied = await f5page
					.evaluate(() => ({
						dark: document.documentElement.classList.contains("dark"),
						lang: document.documentElement.lang,
					}))
					.catch(() => ({ dark: false, lang: "" }));
				if (!applied.dark) {
					const sig = `theme|${route}`;
					if (!audit.signatures.has(sig)) {
						audit.signatures.add(sig);
						audit.findings.push({
							kind: "theme",
							route,
							detail: "dark theme not applied (html.dark missing)",
						});
					}
				}
				if (applied.lang !== "ko") {
					const sig = `locale|${route}`;
					if (!audit.signatures.has(sig)) {
						audit.signatures.add(sig);
						audit.findings.push({
							kind: "locale",
							route,
							detail: `documentElement.lang is "${applied.lang}", expected "ko"`,
						});
					}
				}
				f5.record.overlay = await hasOverlay(f5page);
				await typeIntoFields(f5page);
				await interactUntrusted(f5page);
				await sleep(SETTLE_MS);
				koDarkRoutes += 1;
			} else {
				f5.record.timedOut = true;
			}
			flush(audit, route, f5.record);
			f5.record = null;
		}
		await f5page.close();

		const consoleErrors = [...audit.signatures].filter((s) => s.startsWith("console|")).length;
		const pageErrors = [...audit.signatures].filter((s) => s.startsWith("pageerror|")).length;
		const failedRoutes = [...audit.signatures].filter((s) => s.startsWith("failed|")).length;
		const overlayRoutes = [...audit.signatures].filter((s) => s.startsWith("overlay|")).length;
		return {
			findings: audit.findings,
			consoleErrors,
			pageErrors,
			failedRoutes,
			overlayRoutes,
			overflowRoutes: audit.overflowRoutes.size,
			uploadRoutes,
			koDarkRoutes,
		};
	} finally {
		await browser.close().catch(() => {});
	}
}

// ---------------------------------------------------------------- main

const routes = filesystemRoutes();
const navFindings = staticNavAudit(routes);
await makeFixtures();
const audit = await browserAudit(routes);

const allFindings = [...navFindings, ...audit.findings];
const themeLocaleBugs = allFindings.filter((f) => f.kind === "theme" || f.kind === "locale").length;
const uiBugs =
	audit.consoleErrors +
	audit.pageErrors +
	audit.failedRoutes +
	audit.overlayRoutes +
	audit.overflowRoutes +
	themeLocaleBugs +
	navFindings.length;

for (const f of allFindings) {
	const where = f.route ? ` ${f.route} ` : " ";
	console.log(`FINDING ${f.kind}${where}:: ${f.detail}`);
}
console.log(`AUDIT routes=${routes.length} findings=${allFindings.length}`);
console.log(`METRIC ui_bugs=${uiBugs}`);
console.log(`METRIC console_errors=${audit.consoleErrors}`);
console.log(`METRIC page_errors=${audit.pageErrors}`);
console.log(`METRIC failed_routes=${audit.failedRoutes}`);
console.log(`METRIC overlay_routes=${audit.overlayRoutes}`);
console.log(`METRIC ko_dark_routes=${audit.koDarkRoutes}`);
console.log(`METRIC overflow_routes=${audit.overflowRoutes}`);
console.log(`METRIC nav_mismatches=${navFindings.length}`);
console.log(`METRIC upload_routes=${audit.uploadRoutes}`);
console.log(`METRIC routes_audited=${routes.length}`);
