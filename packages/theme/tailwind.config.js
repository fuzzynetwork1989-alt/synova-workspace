/**
 * Synova Tailwind Configuration
 * Unified Tailwind configuration for all Synova projects
 */

const colors = {
  // Primary Colors
  'primary-blue': '#0066FF',
  'primary-purple': '#7C3AED',
  'primary-teal': '#06B6D4',

  // Neutral Colors
  'neutral-dark': '#1F2937',
  'neutral-medium': '#6B7280',
  'neutral-light': '#F3F4F6',
  'neutral-white': '#FFFFFF',

  // Status Colors
  'status-success': '#10B981',
  'status-warning': '#F59E0B',
  'status-error': '#EF4444',
  'status-info': '#3B82F6',

  // Tailwind defaults
  transparent: 'transparent',
  current: 'currentColor',
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

module.exports = {
  theme: {
    extend: {
      colors,
      fontFamily: {
        primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        heading: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        mono: '"Fira Code", "Courier New", monospace',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1.2' }],
        '6xl': ['60px', { lineHeight: '1.2' }],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0em',
        wide: '0.02em',
        wider: '0.05em',
        widest: '0.1em',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        none: 'none',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066FF 0%, #7C3AED 100%)',
        'gradient-accent': 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
        'gradient-cool': 'linear-gradient(135deg, #06B6D4 0%, #0066FF 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
