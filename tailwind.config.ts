import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-space-grotesk)'],
        sans: ['var(--font-manrope)']
      },
      boxShadow: {
        glass: '0 24px 80px rgba(26, 32, 44, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
