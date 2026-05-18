/**
 * Synova Color Palette
 * Unified color definitions for the entire Synova workspace
 */

export const colors = {
  // Primary Colors
  primary: {
    blue: '#0066FF',
    purple: '#7C3AED',
    teal: '#06B6D4',
  },

  // Neutral Colors
  neutral: {
    darkGray: '#1F2937',
    mediumGray: '#6B7280',
    lightGray: '#F3F4F6',
    white: '#FFFFFF',
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #0066FF 0%, #7C3AED 100%)',
    accent: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
    cool: 'linear-gradient(135deg, #06B6D4 0%, #0066FF 100%)',
  },
} as const;

// Type exports
export type Colors = typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type NeutralColor = keyof typeof colors.neutral;
export type StatusColor = keyof typeof colors.status;

/**
 * Get a color value by path
 * @example getColor('primary', 'blue') // '#0066FF'
 */
export function getColor(
  category: keyof Colors,
  colorName: string
): string | undefined {
  const categoryColors = colors[category];
  if (typeof categoryColors === 'object' && categoryColors !== null) {
    return (categoryColors as Record<string, string>)[colorName];
  }
  return undefined;
}

/**
 * Create a color with opacity
 * @example colorWithOpacity('#0066FF', 0.5) // 'rgba(0, 102, 255, 0.5)'
 */
export function colorWithOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get all colors as a flat object (useful for Tailwind)
 */
export function getFlatColors(): Record<string, string> {
  const flat: Record<string, string> = {};

  Object.entries(colors).forEach(([category, categoryColors]) => {
    if (typeof categoryColors === 'object' && categoryColors !== null) {
      Object.entries(categoryColors).forEach(([colorName, colorValue]) => {
        if (typeof colorValue === 'string') {
          flat[`${category}-${colorName}`] = colorValue;
        }
      });
    }
  });

  return flat;
}

export default colors;
