import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'block',
    'hidden',
    'inline-block',
    'md:block',
    'md:hidden',
    'md:inline-block',
    'lg:block',
    'lg:hidden',
    'lg:inline-block',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
