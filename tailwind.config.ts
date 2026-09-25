import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        // Fallbacks garantem texto legivel mesmo antes da fonte carregar.
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Identidade visual da home (tema escuro ambar).
        brand: ['var(--font-bricolage)', 'Bricolage Grotesque', 'var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        // Paleta "Estudio noturno" da home. Use `studio-*` nas classes.
        studio: {
          bg: '#0E0C0A',
          deep: '#120F0C',
          surface: '#17140F',
          raised: '#1C1812',
          line: '#2A241C',
          edge: '#3A3127',
          text: '#F3EEE6',
          soft: '#B8AEA0',
          muted: '#A89F92',
          faint: '#7D7468',
          amber: '#FFBF1F',
          'amber-hover': '#FFD05C',
          ink: '#1A1206'
        }
      },
      boxShadow: {
        glass: '0 24px 80px rgba(26, 32, 44, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
