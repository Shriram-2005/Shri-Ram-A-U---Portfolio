# Shriram AU Portfolio

A modern portfolio web application built with **Next.js (App Router)**, **Tailwind CSS v4**, **next-themes**, and **Framer Motion**.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Theme Management**: [`next-themes`](https://github.com/pacocoursey/next-themes) (Light / Dark / System mode)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css          # Tailwind CSS v4 setup & dark mode custom variant
│   ├── layout.tsx           # Root layout wrapped with ThemeProvider
│   └── page.tsx             # Animated landing / portfolio showcase page
└── components/
    ├── theme-provider.tsx   # NextThemes client provider wrapper
    └── theme-toggle.tsx     # Animated Light / System / Dark switcher
```

---

## 🛠️ Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

To create a production build:

```bash
npm run build
npm start
```
