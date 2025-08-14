/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Chat-specific colors
        chat: {
          sent: {
            light: '#3b82f6',
            dark: '#1d4ed8',
          },
          received: {
            light: '#f3f4f6',
            dark: '#374151',
          },
          bubble: {
            sent: {
              light: '#3b82f6',
              dark: '#1d4ed8',
            },
            received: {
              light: '#ffffff',
              dark: '#1f2937',
            }
          }
        }
      },
      // Mobile-first spacing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Enhanced animation durations
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
      },
      // Mobile-specific sizing
      minHeight: {
        'touch': '44px',
        'input': '48px',
      },
      maxHeight: {
        'input': '120px', // 5 lines max
      },
      // Message bubble radius
      borderRadius: {
        'message': '16px',
        'message-small': '12px',
      },
      // Drawer animations
      keyframes: {
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-out-left': 'slide-out-left 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      // Mobile viewport utilities
      screens: {
        'xs': '475px',
        'mobile': '640px',
        'tablet': '768px',
        'desktop': '1024px',
      },
    },
  },
  plugins: [],
}