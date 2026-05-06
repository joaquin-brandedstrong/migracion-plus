import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

/**
 * Shared Tailwind preset for migracionplus-academy.
 *
 * Palette policy: brand teal (extracted from the logo "plus" accent #61D0BE)
 * is the ONLY chromatic color in the system. The `accent.*` namespace is kept
 * for legacy class names but resolves to teal shades — there is no second hue.
 * Neutrals come from `ink.*`. Status colors (success/warning/danger/info) stay
 * because they convey semantic meaning, not decoration.
 */
const preset: Partial<Config> = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#61D0BE',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // accent.* is an alias for brand.* — kept so legacy `accent-500` etc.
        // continue to compile to teal. Do not introduce a second hue here.
        accent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        ink: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        success: '#10B981',
        warning: '#0F766E',
        danger: '#EF4444',
        info: '#0D9488',

        // Semantic tokens — these reference CSS variables defined in globals.css
        // so they automatically swap in dark mode.
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        border: 'var(--border)',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-lg': '0 16px 48px 0 rgba(15, 23, 42, 0.12)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        glow: '0 0 24px rgba(15, 118, 110, 0.35)',
        // Udemy-style flat hover lift for course cards.
        card: '0 2px 4px 0 rgba(15, 23, 42, 0.06), 0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 28px -4px rgba(15, 23, 42, 0.18), 0 4px 8px -2px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        // Teal-only mesh — three radial blobs of brand teal at varying intensity.
        'gradient-mesh':
          'radial-gradient(at 20% 20%, hsla(170, 70%, 65%, 0.35) 0px, transparent 50%), radial-gradient(at 80% 30%, hsla(174, 72%, 56%, 0.28) 0px, transparent 50%), radial-gradient(at 50% 80%, hsla(176, 65%, 41%, 0.32) 0px, transparent 50%)',
        'gradient-mesh-dark':
          'radial-gradient(at 20% 20%, hsla(170, 60%, 30%, 0.55) 0px, transparent 50%), radial-gradient(at 80% 30%, hsla(174, 70%, 25%, 0.45) 0px, transparent 50%), radial-gradient(at 50% 80%, hsla(176, 65%, 22%, 0.5) 0px, transparent 50%)',
      },
      animation: {
        'gradient-rotate': 'gradient-rotate 20s linear infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        marquee: 'marquee 32s linear infinite',
        'marquee-pause': 'marquee 32s linear infinite paused',
      },
      keyframes: {
        'gradient-rotate': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--fg)',
            '--tw-prose-headings': 'var(--fg)',
            '--tw-prose-links': 'rgb(15 118 110)',
            'h1, h2, h3, h4': { fontFamily: 'var(--font-fraunces)', fontWeight: '600' },
            'a:hover': { color: 'rgb(13 148 136)' },
          },
        },
      }),
    },
  },
  plugins: [typography, animate],
};

export default preset;
