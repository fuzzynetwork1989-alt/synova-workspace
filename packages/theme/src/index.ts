/**
 * Synova Theme Package
 * Unified design system for the entire Synova workspace
 */

export * from './colors';
export * from './typography';

// Re-export everything as default
import * as colors from './colors';
import * as typography from './typography';

export default {
  colors: colors.default,
  typography: typography.default,
  textStyles: typography.textStyles,
};
