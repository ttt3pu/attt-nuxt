import type { Config } from 'tailwindcss';

export default {
  content: [
    './components/**/*.vue',
    './composables/**/*.ts',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.ts',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        en: ['Poppins', 'sans-serif'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        link: {
          100: '#fffbeb',
          200: '#fffae4',
          300: '#fff8dd',
          DEFAULT: '#fff7d6',
        },
        primary: {
          DEFAULT: '#f9f871',
        },
        secondary: {
          DEFAULT: '#ffb962',
        },
        tertiary: {
          DEFAULT: '#b95d7b',
          300: '#C57891',
        },
        white: {
          DEFAULT: '#e2f1ff;',
        },
        bg: {
          300: '#2e2d50',
          DEFAULT: '#2b1f45',
          500: '#1B1A30',
        },
      },
      maxWidth: {
        DEFAULT: '1600px',
      },
    },
  },
  plugins: [],
} satisfies Config;
