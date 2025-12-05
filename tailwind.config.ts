import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#FAF9F5",
        foreground: "#3B3C36",
        menu: {
          main: "#826644",
          sub: "#D99058",
        },
      },
      fontFamily: {
        serif: ['Noto Serif Korean', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#3B3C36',
            '--tw-prose-headings': '#826644',
            '--tw-prose-links': '#826644',
            '--tw-prose-bold': '#3B3C36',
            '--tw-prose-code': '#D99058',
            '--tw-prose-pre-bg': '#f5f5f5',
            '--tw-prose-pre-code': '#3B3C36',
            color: 'var(--tw-prose-body)',
            h1: { color: 'var(--tw-prose-headings)' },
            h2: { color: 'var(--tw-prose-headings)' },
            h3: { color: 'var(--tw-prose-headings)' },
            a: { color: 'var(--tw-prose-links)' },
            strong: { color: 'var(--tw-prose-bold)' },
            code: { color: 'var(--tw-prose-code)' },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': '#e5e5e5',
            '--tw-prose-headings': '#D99058',
            '--tw-prose-links': '#D99058',
            '--tw-prose-bold': '#e5e5e5',
            '--tw-prose-code': '#826644',
            '--tw-prose-pre-bg': '#1a1a1a',
            '--tw-prose-pre-code': '#e5e5e5',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;