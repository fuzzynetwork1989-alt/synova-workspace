// 🧠 SYNOVA AI - PURE KNOWLEDGE MOBILE THEME
// Revolutionary mobile theme embodying "Knowledge > Money" philosophy

import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Pure Knowledge Color Palette
export const PURE_KNOWLEDGE_COLORS = {
  // Primary Colors
  primary: '#8B5CF6',      // Pure Knowledge Purple
  primaryLight: '#A78BFA',  // Lighter Purple
  primaryDark: '#7C3AED',   // Darker Purple
  primaryRGB: '139, 92, 246',
  
  // Secondary Colors
  secondary: '#10B981',    // Pure Knowledge Green
  secondaryLight: '#34D399', // Lighter Green
  secondaryDark: '#059669',  // Darker Green
  secondaryRGB: '16, 185, 129',
  
  // Accent Colors
  accent: '#F59E0B',       // Pure Knowledge Yellow
  accentLight: '#FCD34D',   // Lighter Yellow
  accentDark: '#D97706',    // Darker Yellow
  accentRGB: '245, 158, 11',
  
  // Cosmic Colors
  cosmic: '#6366F1',        // Cosmic Blue
  cosmicLight: '#818CF8',   // Lighter Cosmic
  cosmicDark: '#4F46E5',    // Darker Cosmic
  cosmicRGB: '99, 102, 241',
  
  // Brilliance
  brilliance: '#FBBF24',     // Brilliance White
  brillianceRGB: '251, 191, 36',
  
  // Background Colors
  background: '#0F0F23',    // Deep Space Background
  surface: '#1A1A2E',       // Surface Background
  tertiary: '#252541',      // Tertiary Background
  card: '#2D2D4A',         // Card Background
  
  // Text Colors
  text: '#FFFFFF',          // Primary Text
  textSecondary: '#A78BFA', // Secondary Text
  textTertiary: '#CBD5E1',  // Tertiary Text
  textMuted: '#64748B',     // Muted Text
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#6366F1',
};

// Pure Knowledge Spacing
export const PURE_KNOWLEDGE_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Pure Knowledge Typography
export const PURE_KNOWLEDGE_TYPOGRAPHY = {
  // Font Families
  primary: 'Inter',
  secondary: 'SF Pro Display',
  mono: 'JetBrains Mono',
  
  // Font Sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  
  // Font Weights
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  
  // Line Heights
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

// Pure Knowledge Border Radius
export const PURE_KNOWLEDGE_BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Pure Knowledge Shadows
export const PURE_KNOWLEDGE_SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  // Glow Effects
  glowPrimary: {
    shadowColor: PURE_KNOWLEDGE_COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glowSecondary: {
    shadowColor: PURE_KNOWLEDGE_COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glowAccent: {
    shadowColor: PURE_KNOWLEDGE_COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glowCosmic: {
    shadowColor: PURE_KNOWLEDGE_COLORS.cosmic,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};

// Pure Knowledge Component Styles
export const PURE_KNOWLEDGE_STYLES = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
  },
  
  // Card Styles
  card: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.card,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.lg,
    padding: PURE_KNOWLEDGE_SPACING.lg,
    margin: PURE_KNOWLEDGE_SPACING.md,
    ...PURE_KNOWLEDGE_SHADOWS.lg,
  },
  
  cardHover: {
    ...PURE_KNOWLEDGE_SHADOWS.glowPrimary,
    borderColor: PURE_KNOWLEDGE_COLORS.primary,
  },
  
  // Button Styles
  button: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.primary,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.lg,
    paddingVertical: PURE_KNOWLEDGE_SPACING.sm,
    paddingHorizontal: PURE_KNOWLEDGE_SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...PURE_KNOWLEDGE_SHADOWS.md,
  },
  
  buttonSecondary: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
    borderWidth: 1,
    borderColor: PURE_KNOWLEDGE_COLORS.primary,
  },
  
  buttonAccent: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.accent,
  },
  
  buttonText: {
    color: PURE_KNOWLEDGE_COLORS.text,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.md,
    fontWeight: PURE_KNOWLEDGE_TYPOGRAPHY.semibold,
  },
  
  buttonSecondaryText: {
    color: PURE_KNOWLEDGE_COLORS.primary,
  },
  
  // Input Styles
  input: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
    borderWidth: 1,
    borderColor: `rgba(${PURE_KNOWLEDGE_COLORS.primaryRGB}, 0.3)`,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.md,
    paddingVertical: PURE_KNOWLEDGE_SPACING.sm,
    paddingHorizontal: PURE_KNOWLEDGE_SPACING.md,
    color: PURE_KNOWLEDGE_COLORS.text,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.md,
  },
  
  inputFocused: {
    borderColor: PURE_KNOWLEDGE_COLORS.primary,
    ...PURE_KNOWLEDGE_SHADOWS.glowPrimary,
  },
  
  // Text Styles
  text: {
    color: PURE_KNOWLEDGE_COLORS.text,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.md,
    lineHeight: PURE_KNOWLEDGE_TYPOGRAPHY.normal,
  },
  
  textSecondary: {
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
  },
  
  textTertiary: {
    color: PURE_KNOWLEDGE_COLORS.textTertiary,
  },
  
  textMuted: {
    color: PURE_KNOWLEDGE_COLORS.textMuted,
  },
  
  // Heading Styles
  heading: {
    color: PURE_KNOWLEDGE_COLORS.text,
    fontWeight: PURE_KNOWLEDGE_TYPOGRAPHY.bold,
    lineHeight: PURE_KNOWLEDGE_TYPOGRAPHY.tight,
  },
  
  heading1: {
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.xxxl,
  },
  
  heading2: {
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.xxl,
  },
  
  heading3: {
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.xl,
  },
  
  heading4: {
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.lg,
  },
  
  // Philosophy Styles
  philosophyContainer: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
    padding: PURE_KNOWLEDGE_SPACING.lg,
    margin: PURE_KNOWLEDGE_SPACING.md,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.lg,
  },
  
  philosophyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    padding: PURE_KNOWLEDGE_SPACING.md,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.md,
    marginBottom: PURE_KNOWLEDGE_SPACING.sm,
  },
  
  philosophyText: {
    color: PURE_KNOWLEDGE_COLORS.text,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.sm,
    fontWeight: PURE_KNOWLEDGE_TYPOGRAPHY.semibold,
    marginLeft: PURE_KNOWLEDGE_SPACING.sm,
  },
  
  // Metrics Styles
  metricsContainer: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
    padding: PURE_KNOWLEDGE_SPACING.lg,
    margin: PURE_KNOWLEDGE_SPACING.md,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.lg,
  },
  
  metricCard: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    padding: PURE_KNOWLEDGE_SPACING.md,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: PURE_KNOWLEDGE_SPACING.sm,
  },
  
  metricValue: {
    color: PURE_KNOWLEDGE_COLORS.primary,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.xl,
    fontWeight: PURE_KNOWLEDGE_TYPOGRAPHY.bold,
    marginBottom: PURE_KNOWLEDGE_SPACING.xs,
  },
  
  metricLabel: {
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.sm,
    marginBottom: PURE_KNOWLEDGE_SPACING.xs,
  },
  
  metricComparison: {
    color: PURE_KNOWLEDGE_COLORS.secondary,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.xs,
    fontWeight: PURE_KNOWLEDGE_TYPOGRAPHY.semibold,
  },
  
  // Header Styles
  header: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    paddingVertical: PURE_KNOWLEDGE_SPACING.lg,
    paddingHorizontal: PURE_KNOWLEDGE_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: PURE_KNOWLEDGE_COLORS.primary,
  },
  
  headerTitle: {
    color: PURE_KNOWLEDGE_COLORS.text,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.xxl,
    fontWeight: PURE_KNOWLEDGE_TYPOGRAPHY.bold,
    textAlign: 'center',
    marginBottom: PURE_KNOWLEDGE_SPACING.sm,
  },
  
  headerSubtitle: {
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.md,
    textAlign: 'center',
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
  },
  
  loadingText: {
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.md,
    marginTop: PURE_KNOWLEDGE_SPACING.md,
  },
  
  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    padding: PURE_KNOWLEDGE_SPACING.lg,
  },
  
  errorText: {
    color: PURE_KNOWLEDGE_COLORS.error,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.md,
    textAlign: 'center',
    marginBottom: PURE_KNOWLEDGE_SPACING.md,
  },
  
  // Success Styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PURE_KNOWLEDGE_COLORS.background,
    padding: PURE_KNOWLEDGE_SPACING.lg,
  },
  
  successText: {
    color: PURE_KNOWLEDGE_COLORS.success,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.md,
    textAlign: 'center',
    marginBottom: PURE_KNOWLEDGE_SPACING.md,
  },
  
  // Animation Styles
  float: {
    // This would be implemented with Animated API in React Native
    // For now, it's a placeholder
  },
  
  glow: {
    // This would be implemented with Animated API in React Native
    // For now, it's a placeholder
  },
  
  // Responsive Styles
  responsiveContainer: {
    maxWidth: width,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Component-specific Styles
  revolutionaryButton: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.primary,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.lg,
    paddingVertical: PURE_KNOWLEDGE_SPACING.md,
    paddingHorizontal: PURE_KNOWLEDGE_SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...PURE_KNOWLEDGE_SHADOWS.glowPrimary,
  },
  
  revolutionaryButtonText: {
    color: PURE_KNOWLEDGE_COLORS.text,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.md,
    fontWeight: PURE_KNOWLEDGE_TYPOGRAPHY.bold,
  },
  
  philosophyCard: {
    backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS.lg,
    padding: PURE_KNOWLEDGE_SPACING.lg,
    margin: PURE_KNOWLEDGE_SPACING.md,
    ...PURE_KNOWLEDGE_SHADOWS.lg,
  },
  
  philosophyTitle: {
    color: PURE_KNOWLEDGE_COLORS.text,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.lg,
    fontWeight: PURE_KNOWLEDGE_TYPOGRAPHY.bold,
    textAlign: 'center',
    marginBottom: PURE_KNOWLEDGE_SPACING.md,
  },
  
  philosophyDescription: {
    color: PURE_KNOWLEDGE_COLORS.textSecondary,
    fontSize: PURE_KNOWLEDGE_TYPOGRAPHY.sm,
    textAlign: 'center',
    lineHeight: PURE_KNOWLEDGE_TYPOGRAPHY.relaxed,
  },
});

// Theme Provider Hook (for React Native)
export const usePureKnowledgeTheme = () => {
  return {
    colors: PURE_KNOWLEDGE_COLORS,
    spacing: PURE_KNOWLEDGE_SPACING,
    typography: PURE_KNOWLEDGE_TYPOGRAPHY,
    borderRadius: PURE_KNOWLEDGE_BORDER_RADIUS,
    shadows: PURE_KNOWLEDGE_SHADOWS,
    styles: PURE_KNOWLEDGE_STYLES,
  };
};

// Dynamic Theme Generator
export const generateDynamicTheme = (customColors = {}) => {
  return {
    ...PURE_KNOWLEDGE_COLORS,
    ...customColors,
  };
};

// Responsive Theme Generator
export const generateResponsiveTheme = (screenWidth) => {
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768;
  
  return {
    ...PURE_KNOWLEDGE_STYLES,
    container: {
      ...PURE_KNOWLEDGE_STYLES.container,
      paddingHorizontal: isSmallScreen ? PURE_KNOWLEDGE_SPACING.sm : PURE_KNOWLEDGE_SPACING.md,
    },
    card: {
      ...PURE_KNOWLEDGE_STYLES.card,
      margin: isSmallScreen ? PURE_KNOWLEDGE_SPACING.sm : PURE_KNOWLEDGE_SPACING.md,
    },
    heading1: {
      ...PURE_KNOWLEDGE_STYLES.heading1,
      fontSize: isSmallScreen ? PURE_KNOWLEDGE_TYPOGRAPHY.xxl : PURE_KNOWLEDGE_TYPOGRAPHY.xxxl,
    },
  };
};

export default {
  PURE_KNOWLEDGE_COLORS,
  PURE_KNOWLEDGE_SPACING,
  PURE_KNOWLEDGE_TYPOGRAPHY,
  PURE_KNOWLEDGE_BORDER_RADIUS,
  PURE_KNOWLEDGE_SHADOWS,
  PURE_KNOWLEDGE_STYLES,
  usePureKnowledgeTheme,
  generateDynamicTheme,
  generateResponsiveTheme,
};
