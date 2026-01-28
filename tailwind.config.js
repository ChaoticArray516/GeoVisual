/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Swiss Style Design System
      colors: {
        // Pure black & white foundation
        'swiss-white': '#FFFFFF',
        'swiss-offwhite': '#FAFAFA',
        'swiss-black': '#000000',
        'swiss-charcoal': '#1A1A1A',

        // Single accent color - Mathematical Blue
        'math-blue': '#0055FF',
        'math-blue-light': '#E6F0FF',
        'math-blue-dark': '#0033CC',

        // Secondary accent - Geometric Red (rare use)
        'geo-red': '#FF3300',
        'geo-red-light': '#FFF0EB',

        // Functional grays (only for borders, dividers)
        'divider-gray': '#E5E5E5',
        'border-gray': '#D1D5DB',
      },

      fontFamily: {
        // Swiss Style Typography System
        'serif-display': ['"Times New Roman"', 'Times', 'serif'],
        'sans-body': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono-math': ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
      },

      fontSize: {
        // Swiss Type Scale - More contrast
        'display-xs': '0.625rem',    // 10px
        'display-sm': '0.75rem',     // 12px
        'display-base': '0.875rem',  // 14px
        'display-md': '1rem',        // 16px
        'display-lg': '1.25rem',     // 20px
        'display-xl': '1.5rem',      // 24px
        'display-2xl': '2rem',       // 32px
        'display-3xl': '2.5rem',     // 40px
        'display-4xl': '3.5rem',     // 56px
        'display-5xl': '4.5rem',     // 72px
      },

      borderRadius: {
        // Minimal or no rounding
        'swiss-none': '0',
        'swiss-sm': '2px',
        'swiss-md': '4px',
      },

      borderWidth: {
        '2': '2px',
        '3': '3px',
      },

      spacing: {
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
      },
    },
  },
  plugins: [],
}
