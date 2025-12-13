/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.625rem',
        'xxxs': '0.5rem',
      },
      colors: {
        'tg-button': 'var(--tg-theme-button-color)',
        'tg-section-bg': 'var(--tg-theme-section-bg-color)',
        'tg-secondary-bg': 'var(--tg-theme-secondary-bg-color)',
        'tg-bg': 'var(--tg-theme-bg-color)',
        'tg-link': 'var(--tg-theme-link-color)',
        'tgui-button-gray': 'var(--tgui--plain_background)',
      },
    },
  },
  plugins: [],
}

