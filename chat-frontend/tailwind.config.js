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
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-out-left': 'slide-out-left 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
      },
      // Enhanced responsive breakpoints for perfect scaling
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Custom breakpoints for specific use cases
        'mobile': '640px',
        'tablet': '768px',
        'desktop': '1024px',
        'wide': '1280px',
      },
      // Enhanced responsive utilities
      width: {
        'drawer-mobile': 'min(320px, 85vw)',
        'drawer-tablet': 'min(380px, 50vw)',
        'drawer-desktop': '320px',
        'drawer-wide': '384px',
      },
      // Enhanced responsive typography
      fontSize: {
        'xs-mobile': ['0.75rem', { lineHeight: '1rem' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.25rem' }],
        'base-mobile': ['1rem', { lineHeight: '1.5rem' }],
        'lg-mobile': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl-mobile': ['1.25rem', { lineHeight: '1.75rem' }],
      },
      // Enhanced responsive spacing
      padding: {
        'mobile': '1rem',
        'tablet': '1.5rem',
        'desktop': '2rem',
      },
      margin: {
        'mobile': '1rem',
        'tablet': '1.5rem',
        'desktop': '2rem',
      },
      // Enhanced responsive gaps
      gap: {
        'mobile': '0.75rem',
        'tablet': '1rem',
        'desktop': '1.5rem',
      },
      // Enhanced responsive border radius
      borderRadius: {
        'mobile': '0.75rem',
        'tablet': '1rem',
        'desktop': '1.25rem',
      },
      // Enhanced responsive shadows
      boxShadow: {
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'tablet': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'desktop': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      // Enhanced responsive z-index
      zIndex: {
        'drawer': '50',
        'modal': '60',
        'tooltip': '70',
        'notification': '80',
      },
    },
  },
  plugins: [
    // Custom plugin for responsive utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Responsive text utilities
        '.text-responsive-xs': {
          fontSize: theme('fontSize.xs-mobile[0]'),
          lineHeight: theme('fontSize.xs-mobile[1].lineHeight'),
          '@screen sm': {
            fontSize: theme('fontSize.xs[0]'),
            lineHeight: theme('fontSize.xs[1].lineHeight'),
          },
        },
        '.text-responsive-sm': {
          fontSize: theme('fontSize.sm-mobile[0]'),
          lineHeight: theme('fontSize.sm-mobile[1].lineHeight'),
          '@screen sm': {
            fontSize: theme('fontSize.sm[0]'),
            lineHeight: theme('fontSize.sm[1].lineHeight'),
          },
        },
        '.text-responsive-base': {
          fontSize: theme('fontSize.base-mobile[0]'),
          lineHeight: theme('fontSize.base-mobile[1].lineHeight'),
          '@screen sm': {
            fontSize: theme('fontSize.base[0]'),
            lineHeight: theme('fontSize.base[1].lineHeight'),
          },
        },
        '.text-responsive-lg': {
          fontSize: theme('fontSize.lg-mobile[0]'),
          lineHeight: theme('fontSize.lg-mobile[1].lineHeight'),
          '@screen sm': {
            fontSize: theme('fontSize.lg[0]'),
            lineHeight: theme('fontSize.lg[1].lineHeight'),
          },
        },
        '.text-responsive-xl': {
          fontSize: theme('fontSize.xl-mobile[0]'),
          lineHeight: theme('fontSize.xl-mobile[1].lineHeight'),
          '@screen sm': {
            fontSize: theme('fontSize.xl[0]'),
            lineHeight: theme('fontSize.xl[1].lineHeight'),
          },
        },
        // Responsive spacing utilities
        '.p-responsive': {
          padding: theme('padding.mobile'),
          '@screen sm': {
            padding: theme('padding.tablet'),
          },
          '@screen lg': {
            padding: theme('padding.desktop'),
          },
        },
        '.m-responsive': {
          margin: theme('margin.mobile'),
          '@screen sm': {
            margin: theme('margin.tablet'),
          },
          '@screen lg': {
            margin: theme('margin.desktop'),
          },
        },
        '.gap-responsive': {
          gap: theme('gap.mobile'),
          '@screen sm': {
            gap: theme('gap.tablet'),
          },
          '@screen lg': {
            gap: theme('gap.desktop'),
          },
        },
        // Responsive border radius utilities
        '.rounded-responsive': {
          borderRadius: theme('borderRadius.mobile'),
          '@screen sm': {
            borderRadius: theme('borderRadius.tablet'),
          },
          '@screen lg': {
            borderRadius: theme('borderRadius.desktop'),
          },
        },
        // Responsive shadow utilities
        '.shadow-responsive': {
          boxShadow: theme('boxShadow.mobile'),
          '@screen sm': {
            boxShadow: theme('boxShadow.tablet'),
          },
          '@screen lg': {
            boxShadow: theme('boxShadow.desktop'),
          },
        },
        // Touch-friendly utilities
        '.touch-friendly': {
          minHeight: '44px',
          minWidth: '44px',
          '@media (hover: hover)': {
            minHeight: '40px',
            minWidth: '40px',
          },
        },
        // Safe area utilities
        '.safe-area-inset': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        // Enhanced focus utilities
        '.focus-visible-ring': {
          '@apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800': {},
        },
        // Enhanced transition utilities
        '.transition-smooth': {
          transitionProperty: 'all',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '200ms',
        },
        // Enhanced backdrop utilities
        '.backdrop-blur-mobile': {
          backdropFilter: 'blur(8px)',
          '@screen sm': {
            backdropFilter: 'blur(12px)',
          },
          '@screen lg': {
            backdropFilter: 'blur(16px)',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
}