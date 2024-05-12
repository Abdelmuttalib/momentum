/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        // sans: 'var(--font-sans)',
        // serif: 'var(--font-serif)',
        inter: "var(--font-inter)",
        "general-sans": "var(--font-general-sans)",
        "plus-jakarta": "var(--font-plus-jakarta)",
        onest: "var(--font-onest)",
      },

      fontSize: {
        xs: "var(--font-xs)",
        sm: "var(--font-sm)",
        base: "var(--font-base)",
        md: "var(--font-md)",
        lg: "var(--font-lg)",
        xl: "var(--font-xl)",
        "2xl": "var(--font-display-xs)",
        "3xl": "var(--font-display-sm)",
        "4xl": "var(--font-display-md)",
        "5xl": "var(--font-display-lg)",
        "6xl": "var(--font-display-xl)",
        "7xl": "var(--font-display-2xl)",
        // "display-xs": "var(--font-display-xs)",
        // "display-sm": "var(--font-display-sm)",
        // "display-md": "var(--font-display-md)",
        // "display-lg": "var(--font-display-lg)",
        // "display-xl": "var(--font-display-xl)",
        // "display-2xl": "var(--font-display-2xl)",
      },

      lineHeight: {
        xs: "var(--line-height-xs)",
        sm: "var(--line-height-sm)",
        base: "var(--line-height-base)",
        md: "var(--line-height-md)",
        lg: "var(--line-height-lg)",
        xl: "var(--line-height-xl)",
        "2xl": "var(--line-height-display-xs)",
        "3xl": "var(--line-height-display-sm)",
        "4xl": "var(--line-height-display-md)",
        "5xl": "var(--line-height-display-lg)",
        "6xl": "var(--line-height-display-xl)",
        "7xl": "var(--line-height-display-2xl)",
        // "display-xs": "var(--line-height-display-xs)",
        // "display-sm": "var(--line-height-display-sm)",
        // "display-md": "var(--line-height-display-md)",
        // "display-lg": "var(--line-height-display-lg)",
        // "display-xl": "var(--line-height-display-xl)",
        // "display-2xl": "var(--line-height-display-2xl)",
      },

      fontWeight: {
        regular: "var(--font-weight-regular)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
      },

      borderRadius: {
        DEFAULT: "var(--border-radius)",
        sm: "var(--border-radius-sm)",
        md: "var(--border-radius-md)",
        lg: "var(--border-radius-lg)",
        xl: "var(--border-radius-xl)",
        full: "9999px",
      },
      /* Transitions */
      // --transition-short: 0.15s;
      // --transition-long: 0.3s;

      transitionDuration: {
        short: "var(--transition-short)",
        long: "var(--transition-long)",
      },

      colors: {
        // primary: {
        //   DEFAULT: '#4040F2',
        //   50: '#F7F7FB',
        //   100: '#D8D8FE',
        //   200: '#B3B3FD',
        //   300: '#8484F8',
        //   400: '#6E6EF7',
        //   500: '#4040F2',
        //   600: '#3333D1',
        //   700: '#2323BE',
        //   800: '#181894',
        //   900: '#0D0D54',
        // },
        background: {
          DEFAULT: "hsl(var(--background))",
          accent: "hsl(var(--color-accent))",
        },

        muted: "hsl(var(--background-muted))",

        /* Hover/Selected */
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-accent-foreground))",
          hover: "hsl(var(--color-accent-hover))",
        },

        ring: "hsl(var(--color-ring))",

        foreground: {
          DEFAULT: "hsl(var(--color-text))",
          light: "hsl(var(--color-text-light))",
          lighter: "hsl(var(--color-text-lighter))",
          muted: "hsl(var(--color-text-muted))",
          "muted-light": "hsl(var(--color-text-muted-light))",
          "muted-dark": "hsl(var(--color-text-muted-dark))",
          "muted-darker": "hsl(var(--color-text-muted-darker))",
        },

        black: "#040a15",
        layer: {
          DEFAULT: "hsl(var(--layer-1))",
          2: "hsl(var(--layer-2))",
          3: "hsl(var(--layer-3))",
          4: "hsl(var(--layer-4))",
        },

        border: {
          DEFAULT: "hsl(var(--color-border))",
          light: "hsl(var(--color-border-light))",
          lighter: "hsl(var(--color-border-lighter))",
          hover: "hsl(var(--color-border-hover))",
          "light-hover": "hsl(var(--color-border-light-hover))",
        },

        "input-border": "hsl(var(--color-input-border))",

        info: {
          DEFAULT: "hsl(var(--color-info))",
          light: "hsl(var(--color-info-light))",
          dark: "hsl(var(--color-info-dark))",
        },

        success: {
          DEFAULT: "hsl(var(--color-success))",
          light: "hsl(var(--color-success-light))",
          dark: "hsl(var(--color-success-dark))",
        },

        error: {
          DEFAULT: "hsl(var(--color-error))",
          light: "hsl(var(--color-error-light))",
          dark: "hsl(var(--color-error-dark))",
        },

        danger: {
          DEFAULT: "hsl(var(--color-danger))",
          light: "hsl(var(--color-danger-light))",
          dark: "hsl(var(--color-danger-dark))",
        },

        warning: {
          DEFAULT: "hsl(var(--color-warning))",
          light: "hsl(var(--color-warning-light))",
          dark: "hsl(var(--color-warning-dark))",
        },

        primary: {
          50: "hsl(var(--color-primary-50))",
          100: "hsl(var(--color-primary-100))",
          200: "hsl(var(--color-primary-200))",
          300: "hsl(var(--color-primary-300))",
          400: "hsl(var(--color-primary-400))",
          500: "hsl(var(--color-primary-500))",
          600: "hsl(var(--color-primary-600))",
          700: "hsl(var(--color-primary-700))",
          800: "hsl(var(--color-primary-800))",
          900: "hsl(var(--color-primary-900))",
          DEFAULT: "hsl(var(--color-primary))",
          hover: "hsl(var(--color-primary-hover))",
          active: "hsl(var(--color-primary-active))",
          disabled: "hsl(var(--color-primary-disabled))",
        },

        gray: {
          DEFAULT: "hsl(var(--color-gray))",
          hover: "hsl(var(--color-gray-hover))",
          50: "hsl(var(--color-gray-50))",
          100: "hsl(var(--color-gray-100))",
          200: "hsl(var(--color-gray-200))",
          300: "hsl(var(--color-gray-300))",
          400: "hsl(var(--color-gray-400))",
          500: "hsl(var(--color-gray-500))",
          600: "hsl(var(--color-gray-600))",
          650: "hsl(var(--color-gray-650))",
          700: "hsl(var(--color-gray-700))",
          750: "hsl(var(--color-gray-750))",
          800: "hsl(var(--color-gray-800))",
          850: "hsl(var(--color-gray-850))",
          900: "hsl(var(--color-gray-900))",
          950: "hsl(var(--color-gray-950))",
        },

        red: {
          50: "hsl(var(--color-red-50))",
          100: "hsl(var(--color-red-100))",
          200: "hsl(var(--color-red-200))",
          300: "hsl(var(--color-red-300))",
          400: "hsl(var(--color-red-400))",
          500: "hsl(var(--color-red-500))",
          600: "hsl(var(--color-red-600))",
          700: "hsl(var(--color-red-700))",
          800: "hsl(var(--color-red-800))",
          900: "hsl(var(--color-red-900))",
          DEFAULT: "hsl(var(--color-red))",
        },

        green: {
          50: "hsl(var(--color-green-50))",
          100: "hsl(var(--color-green-100))",
          200: "hsl(var(--color-green-200))",
          300: "hsl(var(--color-green-300))",
          400: "hsl(var(--color-green-400))",
          500: "hsl(var(--color-green-500))",
          600: "hsl(var(--color-green-600))",
          700: "hsl(var(--color-green-700))",
          800: "hsl(var(--color-green-800))",
          900: "hsl(var(--color-green-900))",
          DEFAULT: "hsl(var(--color-green))",
        },

        yellow: {
          50: "hsl(var(--color-yellow-50))",
          100: "hsl(var(--color-yellow-100))",
          200: "hsl(var(--color-yellow-200))",
          300: "hsl(var(--color-yellow-300))",
          400: "hsl(var(--color-yellow-400))",
          500: "hsl(var(--color-yellow-500))",
          600: "hsl(var(--color-yellow-600))",
          700: "hsl(var(--color-yellow-700))",
          800: "hsl(var(--color-yellow-800))",
          900: "hsl(var(--color-yellow-900))",
          DEFAULT: "hsl(var(--color-yellow))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
