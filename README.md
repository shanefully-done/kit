# kit.

A single-page developer toolkit — 20 instruments that run entirely in your browser. No API routes, no database, no auth, no telemetry: every route prerenders to static HTML and all computation (hashing, parsing, encoding, QR, EXIF) happens client-side.

Built with [Next.js 15](https://nextjs.org) (App Router), React 19, TypeScript, Tailwind CSS v4, and shadcn/ui, dressed in a Swiss Industrial Print design system: paper substrate, carbon ink, one hazard-red accent, zero rounded corners.

Live at [kit.ixtj.dev](https://kit.ixtj.dev).

## Tools

### Converters & Parsers

| Tool                   | Route                                        |
| ---------------------- | -------------------------------------------- |
| Base64 Encoder/Decoder | `/converters-parsers/base64-encoder-decoder` |
| Base64 Image Converter | `/converters-parsers/base64-image-converter` |
| CRON Parser            | `/converters-parsers/cron-parser`            |
| JSON Parser            | `/converters-parsers/json-parser`            |
| JWT Decoder            | `/converters-parsers/jwt-decoder`            |
| Number Base Converter  | `/converters-parsers/number-base-converter`  |
| Regex Tester           | `/converters-parsers/regex-tester`           |
| Text Case Converter    | `/converters-parsers/text-case`              |
| Timestamp Converter    | `/converters-parsers/timestamp-converter`    |
| Timezone Converter     | `/converters-parsers/timezone-converter`     |
| Unit Converter         | `/converters-parsers/unit-converter`         |
| URL Encoder/Decoder    | `/converters-parsers/url-encoder-decoder`    |
| URL Parser             | `/converters-parsers/url-parser`             |

### Generators

| Tool                       | Route                  |
| -------------------------- | ---------------------- |
| Gradient Generator         | `/generators/gradient` |
| Hash Generator             | `/generators/hash`     |
| Password Generator         | `/generators/password` |
| Port Number Generator      | `/generators/port`     |
| QR Code Generator & Reader | `/generators/qr-code`  |
| UUID Generator             | `/generators/uuid`     |

### Viewers & Misc

| Tool                  | Route                                          |
| --------------------- | ---------------------------------------------- |
| API Directory         | `/viewers-miscellaneous/api-directory`         |
| Image Metadata Viewer | `/viewers-miscellaneous/image-metadata-viewer` |

## Design System

One archetype, committed fully: **Swiss Industrial Print, light-only**. There is no dark mode.

- **Substrate** — paper `#F4F4F0`, panel `#FCFCFA`, muted paper `#E9E8E2`
- **Ink** — `#0A0A0A` for text, borders, and structural rules (1px internal, 2px outer panels)
- **Hazard red** — `#E61919`, the single accent. Vital data, errors, selection, focus. Never decoration.
- **Typography** — Inter Black for macro headings (uppercase, `-0.04em` tracking, compressed leading); IBM Plex Mono for everything data-adjacent. Labels and chrome are uppercase micro type; user data stays verbatim.
- **Geometry** — square corners everywhere. No gradients, no backdrop blur, no soft shadows. Floating layers (dialogs, popovers, toasts) get a hard `4px 4px 0` offset shadow instead.

Tokens live in `app/globals.css` (`--ink`, `--paper`, `--hazard` and the shadcn token set); all 40+ primitives in `components/ui/` implement the system, so new tools inherit it by using them.

## Getting Started

[Bun](https://bun.sh) is recommended; npm/pnpm/yarn also work.

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables are required — the app has no server dependencies to configure.

### Commands

| Command         | Action                                              |
| --------------- | --------------------------------------------------- |
| `bun install`   | Install dependencies                                |
| `bun run dev`   | Dev server (Turbopack)                              |
| `bun run lint`  | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `bun run build` | Production build                                    |
| `bun run start` | Serve the production build                          |

Change order: **edit → lint → build → commit**. No test runner is configured.

## Project Structure

```
app/
  page.tsx                        # Homepage: spec-sheet index of all tools
  layout.tsx                      # Shell: sidebar, fonts, toasters, noise overlay
  globals.css                     # Design tokens + base layer
  converters-parsers/<tool>/      # Client-side tool pages
  generators/<tool>/
  viewers-miscellaneous/<tool>/
components/
  ToolPageLayout.tsx              # Bordered panel wrapper for tool pages
  ToolHeader.tsx                  # Macro-typography header bar
  ui/                             # shadcn/ui primitives, restyled to the system
data/
  api-list.json                   # Static dataset for the API Directory
lib/utils.ts                      # cn() helper
public/                           # Static files
```

All tool pages are client components (`"use client"`). There are no server components with data fetching, no API routes, and no server actions anywhere in the app.

## Adding a Tool

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
   		>
   			{/* tool UI */}
   		</ToolPageLayout>
   	);
   }
   ```

2. **`components/ui/sidebar.tsx`** — add the entry to its category in the `groups` array.

3. **`app/page.tsx`** — add the tool to the matching section of the homepage data array.

Follow the design contract above: use the existing primitives, label compartments in mono uppercase, keep user data verbatim, and reserve red for things that matter.

## Deployment

The production build is fully static — every route is prerendered. Deploy to [Vercel](https://vercel.com/new), or any host that can serve a Next.js build (or plain static files). Nothing to configure.

## Credits

Inspired by [utilsfor.dev](https://utilsfor.dev) by [Jairon Landa](https://github.com/Jaironlanda).

© 2026 [IXTJ](https://www.ixtj.dev/)
