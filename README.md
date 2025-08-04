# kit.

A fast, privacy-conscious collection of developer tools built with **Next.js 15**, **TypeScript**, and **shadcn/ui** — designed for speed, simplicity, and local-first convenience.

> ⚠️ Performance, feature completeness, and bug-free operation are not guaranteed. Use at your own discretion.

---

## ✨ Features

### 🔁 Converters & Parsers

- ✅ Base64 encoder/decoder
- ✅ URL encoder/decoder and parser
- ✅ JSON formatter and parser
- ✅ CRON expression parser
- ✅ Regex tester
- ✅ Number base converter
- ✅ Text case converter
- ✅ Timestamp converter
- ✅ Timezone converter
- ✅ Unit converter
- ✅ JWT decoder

### ⚙️ Generators

- 🔢 UUID generator
- 🔐 Password generator
- 🔑 Hash generator
- 🎨 Gradient generator
- 📱 QR code generator & reader

### 🔍 Viewers & Misc

- 📚 API directory
- 🖼️ Image metadata viewer

---

## 🧱 Tech Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com)
- Tailwind CSS
- Prettier for code formatting

---

## 🚀 Getting Started

### Requirements

- [Node.js 20+](https://nodejs.org/) _(only if not using Bun)_
- [Bun v1.1+](https://bun.sh) _(recommended for speed)_

### Installation

#### Using Bun _(recommended)_

```bash
bun install
```

#### Or use your preferred package manager:

```bash
npm install     # npm
pnpm install    # pnpm
yarn            # yarn
```

### Development

Start the dev server:

```bash
bun dev
# or:
npm run dev
pnpm dev
yarn dev
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
app/                # Next.js App Router pages
components/         # Shared UI components
hooks/              # Custom React hooks
data/               # Static datasets (e.g., API listings)
lib/                # Utility functions
public/             # Static files
```

### Tool Directories

- `app/converters-parsers/`
- `app/generators/`
- `app/viewers-miscellaneous/`

Main entry: [`app/page.tsx`](app/page.tsx)
Hot reloading is enabled during development.

---

## 📦 Build & Deploy

### Production Build

```bash
bun run build
# or:
npm run build
pnpm build
yarn build
```

### Start Server

```bash
bun run start
# or:
npm run start
pnpm start
yarn start
```

### Environment Variables

Most tools are fully client-side and require no `.env` configuration.
If you integrate external services, follow the [Next.js env guide](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) and use `.env.local`.

---

## ☁️ Deployment

### 🔗 Deploy to Vercel _(Recommended)_

1. Push the repo to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your project
4. Configure environment variables if needed
5. Deploy

More info: [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)

### 🌍 Other Platforms

This is a standard Next.js app and can be deployed to any environment that supports Node.js or Bun.
Vercel is recommended for best DX, CI/CD, and edge support.

---

## 🙏 Credits & Inspiration

This project was inspired by the excellent work at [utilsfor.dev](https://utilsfor.dev) by [Jairon Landa](https://github.com/Jaironlanda).
