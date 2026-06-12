/**
 * Synova Typography System
 * Unified typography definitions for the entire Synova workspace
 */

export const typography = {
  // Font Families
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    heading: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Font Sizes
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },

  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Predefined text styles
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
    fontFamily: typography.fonts.heading,
  },
  h2: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
    fontFamily: typography.fonts.heading,
  },
  h3: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
    fontFamily: typography.fonts.heading,
  },
  h4: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal,
    fontFamily: typography.fonts.heading,
  },
  h5: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal,
    fontFamily: typography.fonts.heading,
  },
  h6: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal,
    fontFamily: typography.fonts.heading,
  },

  // Body Text
  bodyLarge: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
    fontFamily: typography.fonts.primary,
  },
  bodyBase: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
    fontFamily: typography.fonts.primary,
  },
  bodySmall: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
    fontFamily: typography.fonts.primary,
  },

  // Labels & Captions
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal,
    fontFamily: typography.fonts.primary,
    letterSpacing: typography.letterSpacing.wide,
  },
  caption: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
    fontFamily: typography.fonts.primary,
  },

  // Code
  code: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
    fontFamily: typography.fonts.mono,
  },
} as const;

// Type exports
export type Typography = typeof typography;
export type TextStyle = keyof typeof textStyles;

/**
 * Get a typography value by path
 * @example getTypography('sizes', 'base') // '16px'
 */
export function getTypography(
  category: keyof Typography,
  typographyName: string
): string | number | undefined {
  const categoryTypography = typography[category];
  if (typeof categoryTypography === 'object' && categoryTypography !== null) {
    return (categoryTypography as Record<string, string | number>)[typographyName];
  }
  return undefined;
}

/**
 * Get a predefined text style
 * @example getTextStyle('h1') // { fontSize: '48px', fontWeight: 700, ... }
 */
export function getTextStyle(
  styleName: TextStyle
): Record<string, string | number> {
  return textStyles[styleName];
}

export default typography;
