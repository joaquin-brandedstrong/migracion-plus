import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

/**
 * Shared Tailwind preset for migracionplus-academy.
 * Brand palette is the FALLBACK from the build prompt section 3.2.
 * If brand-assets/extracted-palette.json was generated, those values
 * supersede the ones below — keep both in sync via PALETTE_NOTES.md.
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
        // Anchored on the extracted brand teal #61D0BE (logo "plus" accent).
        // Lighter shades 50–300 keep the original turquoise; 400+ deepen into
        // accessible teals for buttons and dark surfaces. See PALETTE_NOTES.md.
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
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
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
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',

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
      },
      backgroundImage: {
        'gradient-mesh':
          'radial-gradient(at 20% 20%, hsla(170, 70%, 65%, 0.4) 0px, transparent 50%), radial-gradient(at 80% 30%, hsla(40, 100%, 70%, 0.35) 0px, transparent 50%), radial-gradient(at 50% 80%, hsla(190, 70%, 55%, 0.3) 0px, transparent 50%)',
        'gradient-mesh-dark':
          'radial-gradient(at 20% 20%, hsla(170, 60%, 30%, 0.5) 0px, transparent 50%), radial-gradient(at 80% 30%, hsla(40, 70%, 40%, 0.3) 0px, transparent 50%), radial-gradient(at 50% 80%, hsla(190, 60%, 25%, 0.45) 0px, transparent 50%)',
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
