# AGENTS.md

## Commands

```bash
bun install          # install deps (Bun recommended, npm/pnpm/yarn also work)
bun run dev          # dev server with Turbopack (next dev --turbopack)
bun run lint         # ESLint via next lint (uses next/core-web-vitals + next/typescript)
bun run build        # production build (next build)
```

**Order for changes:** `edit → lint → build → commit`

No test runner is configured.

## Architecture

Single-page Next.js 15 App Router app — a collection of client-side developer tools.

```
app/
  page.tsx                        # Homepage with category cards + tool links
  layout.tsx                      # Root layout: sidebar, ThemeProvider, Toaster
  converters-parsers/<tool>/page.tsx
  generators/<tool>/page.tsx
  viewers-miscellaneous/<tool>/page.tsx
components/
  ToolPageLayout.tsx              # Wrapper: header slot + Card body + optional footer
  ToolHeader.tsx                  # Title bar with icon + optional actions
  ui/                             # shadcn/ui components (50 files)
  theme-provider.tsx              # next-themes wrapper
  MobileNavToggle.tsx             # Sheet trigger for mobile nav
hooks/
  use-mobile.ts, use-mounted.ts
lib/utils.ts                      # cn() helper (clsx + tailwind-merge)
data/api-list.json                # Static dataset for API Directory tool
```

- All tool pages live one folder deep under their category route and export a default function component.
- Tool pages are **all client components** (`"use client"` at top). No server components, no API routes, no server actions.
- The homepage (`app/page.tsx`) is also `"use client"`.

## Adding a New Tool

Three files to touch:

1. **`app/<category>/<tool-name>/page.tsx`** — the tool page
2. **`components/ui/sidebar.tsx`** — add entry to the `tools` array (around line 22)
3. **`app/page.tsx`** — add entry to the matching category's `hrefs` array

### Tool page pattern

```tsx
"use client";

import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { SomeIcon } from "lucide-react";
// ... other shadcn/ui imports

export default function ToolPage() {
	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<SomeIcon aria-hidden />}
					title="Tool Name"
				/>
			}
		>
			{/* tool UI */}
		</ToolPageLayout>
	);
}
```

### Sidebar entry format

```ts
{ name: "Tool Name", href: "/category/tool-name" },
```

### Homepage entry format

```ts
{ label: "Short Name", href: "/category/tool-name" },
```

## Style & Formatting

- **Prettier**: tabs (width 1), `useTabs: true`
- **shadcn/ui**: "new-york" style, "stone" base color, Lucide icons, CSS variables
- **Tailwind CSS v4** with `@tailwindcss/postcss` (not the v3 config format)
- **Path alias**: `@/*` maps to repo root
- **Fonts**: Geist Sans + Geist Mono via `next/font/google`

## Common Pitfalls

- **`<img>` → use `next/image`**: ESLint rule `@next/next/no-img-element` blocks raw `<img>` tags. Import as `import NextImage from "next/image"` to avoid collision with the global `Image` constructor (needed for canvas/EXIF operations in some tools). Add `unoptimized` prop for data URLs or blob URLs.
- **`catch (error)` when unused**: `@typescript-eslint/no-unused-vars` flags unused catch bindings. Use bare `catch` instead.
- **`useCallback` + `useEffect` ordering**: Define `useCallback` before the `useEffect` that references it. ESLint `react-hooks/exhaustive-deps` enforces complete dependency arrays.
- **`ObjectURL` leaks**: When using `URL.createObjectURL()`, revoke in a `useEffect` cleanup return. Revoke the previous URL before creating a new one.
- **Theme-dependent icons**: Use `useMounted()` hook to avoid SSR/CSR hydration mismatch for theme-dependent renders (dark/light icon toggles).
- **Clipboard**: Use `navigator.clipboard.writeText()` + `useToast` for copy feedback. Some older tools use a `copyStatus` state pattern instead.
- **`.omo/` directory**: opencode internal metadata — do NOT commit. Not in `.gitignore` by default but should be excluded from commits.
- **`docs/` and `tasks/`**: Listed in `.gitignore` — excluded from version control.

## Key Dependencies

- Next.js 15.4, React 19, TypeScript 5
- shadcn/ui (new-york), Radix UI primitives, Lucide React icons
- `next-themes` for dark mode (class-based, system default)
- No database, no auth, no external API calls — all tools are fully client-side
