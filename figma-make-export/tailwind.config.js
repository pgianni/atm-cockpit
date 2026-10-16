/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Mapped onto the CSS custom properties declared in src/index.css.
      // Dark mode swaps the variables on <html class="dark">, so every
      // utility below follows the theme without a `dark:` variant.
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover:   'var(--color-primary-hover)',
          subtle:  'var(--color-primary-subtle)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          hover:   'var(--color-danger-hover)',
        },
        page:    'var(--color-bg-page)',
        surface: 'var(--color-bg-surface)',
        banner:  'var(--color-bg-header-bkg)',
        major:   'var(--color-text-major)',
        minor:   'var(--color-text-minor)',
        reverse: 'var(--color-text-reverse)',
        line: {
          DEFAULT: 'var(--color-border-default)',
          danger:  'var(--color-border-danger)',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      // Font sizes carry the token line-heights (--fs-* / --lh-*).
      fontSize: {
        sm:     ['14px', '22px'],
        base:   ['16px', '24px'],
        lg:     ['18px', '28px'],
        xl:     ['20px', '30px'],
        '2xl':  ['24px', '36px'],
      },
      boxShadow: {
        header: 'var(--shadow-header)',
      },
      keyframes: {
        'page-enter': {
          from: { opacity: '0', transform: 'translateY(5px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'suggestions-in': {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'login-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-8px)' },
          '40%':      { transform: 'translateX(8px)' },
          '60%':      { transform: 'translateX(-5px)' },
          '80%':      { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'page-enter': 'page-enter 0.2s ease both',
        'suggestions-in': 'suggestions-in 0.12s ease',
        'fade-in': 'fade-in 0.15s ease',
        'login-shake': 'login-shake 0.45s ease',
      },
    },
  },
  plugins: [],
}
