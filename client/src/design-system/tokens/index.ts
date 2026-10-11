/**
 * HireMate Design Tokens
 * Centralized semantic tokens for colors, typography, spacing, geometry, and motion.
 */

export const colors = {
  // Base Surfaces
  background: '#080D0F',
  surface: '#0E1518',
  surfaceElevated: '#141D20',
  surfaceHover: '#1A2528',
  surfaceActive: '#1F2E32',

  // Typography & Text Contrast
  foreground: '#F2F0E9',
  foregroundMuted: '#A0ADB0',
  foregroundSubtle: '#607074',
  foregroundInverse: '#080D0F',

  // Borders & Dividers
  border: '#273438',
  borderStrong: '#3A4C52',
  borderFocus: '#70D6E8',

  // Accent & Highlights (Restrained usage)
  accent: '#70D6E8', // Cyan
  accentHover: '#8DE0EE',
  accentSubtle: '#132B32',
  accentMuted: 'rgba(112, 214, 232, 0.12)',

  // Secondary Warm & Cool Accents
  teal: '#77B7A5', // Muted Teal
  tealSubtle: 'rgba(119, 183, 165, 0.14)',
  cream: '#E9D8B4', // Warm Cream
  creamSubtle: 'rgba(233, 216, 180, 0.12)',

  // Semantic Statuses
  success: '#4ADE80',
  successSubtle: 'rgba(74, 222, 128, 0.12)',
  warning: '#FBBF24',
  warningSubtle: 'rgba(251, 191, 36, 0.12)',
  danger: '#F87171',
  dangerSubtle: 'rgba(248, 113, 113, 0.12)',
  info: '#70D6E8',
  infoSubtle: 'rgba(112, 214, 232, 0.12)',

  // Focus Ring
  focusRing: '#70D6E8',
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.011em' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.014em' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.017em' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.021em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.024em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.026em' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  // Restrained geometry (not excessive pill shapes by default)
  radii: {
    none: '0px',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },
  borderWidth: {
    default: '1px',
    thick: '2px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    md: '0 4px 12px 0 rgba(0, 0, 0, 0.45)',
    lg: '0 10px 25px -5px rgba(0, 0, 0, 0.55), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    popover: '0 12px 30px -4px rgba(0, 0, 0, 0.65), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  },
  durations: {
    fast: '150ms',
    normal: '200ms',
    slow: '250ms',
  },
  easings: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
};

export default tokens;
