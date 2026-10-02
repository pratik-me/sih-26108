/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0A192F',
          dark: '#081325',
          blue: '#1E3A8A',
          saffron: '#D97706',
          slate: '#F8FAFC',
          gold: '#B45309'
        },
        navy: {
          bg: '#07111F',
          section: '#0B1A2B',
          card: '#10243A',
          'card-hover': '#153653',
          'card-active': '#102E47',
          border: '#263B50',
          blue: '#1268B3',
          action: '#1583D1',
          cyan: '#16A9D8',
          text: '#F1F5F9',
          'text-secondary': '#A8B6C7',
          'text-muted': '#7F91A5',
          success: '#22C55E'
        },
        bis: {
          navy: '#0B1F3A',
          blue: '#0057A8',
          'blue-hover': '#004783',
          cyan: '#0E9FCE',
          border: '#D8E3EE',
          'border-light': '#E2EAF1',
          'border-accent': '#B9DDED',
          bg: '#F7FAFC',
          card: '#FFFFFF',
          hover: '#F1F7FC',
          selected: '#EAF4FB',
          'selected-card': '#F0F8FD',
          secondary: '#52657A',
          muted: '#7A8CA0',
          text: '#263B53',
          icon: '#526B83',
          success: '#16845B',
          gold: '#C58A16',
          error: '#C93636',
          900: '#03045E', // Deep Twilight
          800: '#023E8A', // French Blue
          700: '#0077B6', // Bright Teal Blue
          600: '#0096C7', // Blue Green
          500: '#00B4D8', // Turquoise Surf
          400: '#48CAE4', // Sky Aqua
          300: '#90E0EF', // Frosted Blue
          200: '#ADE8F4', // Frosted Blue Light
          100: '#CAF0F8', // Light Cyan
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#1E3A8A',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F1F5F9',
          foreground: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    }
  },
  plugins: []
};
