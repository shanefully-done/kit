# AGENTS.md

## Commands

```bash
bun install          # install deps (Bun recommended; npm/pnpm/yarn also work)
bun run dev          # dev server with Turbopack (next dev --turbopack)
bun run lint         # ESLint (next/core-web-vitals + next/typescript, flat config)
bun run build        # production build (next build)
bun run start        # serve the production build
```

**Order for changes:** `edit → lint → build → commit`

No test runner is configured.

## Architecture

Single-page Next.js 15 (App Router) app — 35 client-side developer tools in three categories. No database, no auth, no API routes, no server actions; every route prerenders to static HTML and all computation happens in the browser.

```
app/
  layout.tsx                            # Shell: desktop sidebar, mobile Sheet nav, I18nProvider, ThemeProvider, both toasters
  page.tsx                              # Homepage: spec-sheet index rendered from the `categories` array
  globals.css                           # Design tokens (light + dark) + Tailwind v4 @theme wiring
  manifest.ts, icon.png, favicon.ico    # PWA manifest + app icons
  converters-parsers/<tool>/page.tsx    # 17 tools
  generators/<tool>/page.tsx            # 12 tools
  viewers-miscellaneous/<tool>/page.tsx # 6 tools
components/
  ToolPageLayout.tsx              # Bordered panel wrapper (header / children / footer slots)
  ToolHeader.tsx                  # Macro-typography title bar (icon + title + actions)
  theme-provider.tsx              # next-themes wrapper (class attribute, system default)
  MobileNavToggle.tsx             # Sheet trigger for the mobile nav
  ui/                             # shadcn/ui primitives restyled to the design system (51 files)
hooks/
  use-mobile.ts                   # viewport < 768px
  use-persistent-state.ts         # useState persisted to localStorage under `devkit:`
lib/utils.ts                      # cn() helper (clsx + tailwind-merge)
lib/i18n/                         # en.ts (source of truth) + ko.ts (typed Dictionary) + I18nProvider/useI18n
data/api-list.json                # Static dataset for the API Directory tool
```

- Tool pages live one folder deep under their category route and export a default function component. They are **all client components** (`"use client"` at top). The homepage is `"use client"` too.
- `components/ui/sidebar.tsx` is not the stock shadcn sidebar — it is the entire nav: the `groups` array, the filter input, active-route highlighting (`pathname === tool.href` → `bg-ink text-paper`), the theme row (system/light/dark), and the EN/한국어 language row.
- **Localization:** `lib/i18n/en.ts` is the source of truth; `ko.ts` is typed `Dictionary = typeof en`, so any missing Korean key is a compile error. Components use `const { t, locale } = useI18n()` and `t("tools.<camelCaseFolder>.<key>", vars)` with literal paths. Precedence: stored explicit choice (`devkit:locale`) > browser languages > English; only explicit toggles persist. Metadata/OG, technical tokens (JSON, SHA-256, chmod…), and tool outputs stay untranslated.

## Design System

Two committed modes toggled wholesale, never mixed: **Swiss Industrial Print** (light, default) and **Tactical Telemetry** (dark). The full spec lives in README.md; the rules that constrain code:

- Tokens in `app/globals.css`: `--ink`, `--paper`, `--hazard-text` plus the shadcn set. Light: ink `#1C1B18` on paper `#F2F1EB`; dark inverts wholesale to phosphor `#D8D5CD` on CRT `#131312`, with red-as-text lightening `#E61919` → `#FF6B5E`.
- Radius is `0rem` everywhere — square corners only. No gradients, backdrop blur, or soft shadows; floating layers (dialogs, popovers, toasts) use hard `4px 4px 0` offset shadows.
- Hazard red is reserved for vital data, errors, selection, and focus. Never decoration.
- Typography: Inter Black uppercase `-0.04em` for macro headings (`ToolHeader` does this); IBM Plex Mono at weight 500 for data-adjacent text; labels and chrome in uppercase micro type; user data stays verbatim. Korean glyphs fall through to Pretendard Variable (per-glyph fallback after Inter/IBM Plex Mono in both stacks).
- Build tool UI from existing `components/ui/` primitives so new tools inherit the system; wire color through tokens (`border-ink`, `bg-paper`, `text-hazard-text`), not raw hex.

## Adding a New Tool

Three files:

1. **`app/<category>/<tool-name>/page.tsx`** — the tool page:

   ```tsx
   "use client";

   import { ToolPageLayout } from "@/components/ToolPageLayout";
   import { ToolHeader } from "@/components/ToolHeader";
   import { SomeIcon } from "lucide-react";

   export default function ToolPage() {
   	return (
   		<ToolPageLayout
   			header={<ToolHeader icon={<SomeIcon aria-hidden />} title="Tool Name" />}
   			footer={<p className="font-mono text-xs uppercase">Optional footer compartment</p>}
   		>
   			{/* tool UI */}
   		</ToolPageLayout>
   	);
   }
   ```

2. **`components/ui/sidebar.tsx`** — add the entry to the matching category in the `groups` array (labels are uppercase there, e.g. `"GENERATORS"`):

   ```ts
   { name: "Tool Name", href: "/category/tool-name" },
   ```

3. **`app/page.tsx`** — add it to the matching category in the `categories` array (titles are title-case there, e.g. `"Generators"`):

   ```ts
   { name: "Tool Name", href: "/category/tool-name" },
   ```

The homepage unit count is computed from `categories`, so there is no counter to bump.

## State, Toasts, Clipboard

- **Persistence**: `usePersistentState(key, defaultValue, isValid?)` from `hooks/use-persistent-state.ts` — a `useState` drop-in persisted to localStorage under `devkit:<key>`. Only for small, non-sensitive preferences (never inputs, outputs, file contents, or secrets). SSR-safe on first render.
- **Toasts**: both the use-toast `<Toaster />` and Sonner's `<SonnerToaster />` are mounted in the layout. New code should use Sonner: `import { toast } from "sonner"`.
- **Clipboard**: `navigator.clipboard.writeText()` + `toast()` for feedback. A legacy `copyStatus` state pattern survives in `generators/port` and `generators/uuid` — don't copy it.

## Style & Formatting

- **Prettier**: tabs, width 1 (`.prettierrc`)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — design tokens wired through `@theme inline` in `app/globals.css`; there is no v3-style config file
- **Path alias**: `@/*` maps to repo root (`tsconfig.json`)
- **Fonts**: Inter + IBM Plex Mono via `next/font/google` (`--font-inter`, `--font-ibm-plex-mono`)

## Common Pitfalls

- **`<img>` → `next/image`**: ESLint `@next/next/no-img-element` blocks raw `<img>` tags. Import as `import NextImage from "next/image"` (avoids collision with the global `Image` constructor used by canvas/EXIF tools) and add `unoptimized` for data URLs and blob URLs.
- **Unused catch bindings**: `@typescript-eslint/no-unused-vars` flags them. Use bare `catch` — or bind and use the error (`catch (error: unknown)`).
- **`useCallback` + `useEffect` ordering**: define the `useCallback` before any `useEffect` that references it; `react-hooks/exhaustive-deps` enforces complete dependency arrays.
- **ObjectURL leaks**: revoke every `URL.createObjectURL()` in a `useEffect` cleanup return; revoke the previous URL before creating a new one.
- **Theme-dependent renders**: there is no `useMounted` hook. Guard with a local `mounted` state (`useState(false)` + `setMounted(true)` in an effect) to avoid SSR/CSR hydration mismatch — see the theme toggle in `components/ui/sidebar.tsx`.
- **`.kilocode`, `docs/`, `tasks/`** are gitignored — never commit them.

## Key Dependencies

- Next.js 15.4, React 19, TypeScript 5, Tailwind CSS v4, `tw-animate-css`
- Radix UI primitives (shadcn/ui structure), Lucide React icons, `next-themes` (class-based, system default), `sonner`
- `pretendard` (dynamic-subset CSS imported in `app/layout.tsx`; no `next/font`) — Korean glyph fallback. i18n is custom typed dictionaries in `lib/i18n/`, zero runtime deps.
- Domain libs already available before adding a new one: `crypto-js`, `qrcode` + `jsqr`, `jsbarcode`, `otpauth`, `convert-units`, `cronstrue`, `date-fns` + `date-fns-tz`, `diff`, `js-tiktoken`, `js-yaml`, `smol-toml`, `react-hook-form` + `zod`, `uuid` / `ulid` / `nanoid`
