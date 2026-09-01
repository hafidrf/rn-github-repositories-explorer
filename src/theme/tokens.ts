/**
 * Design tokens — modern, cohesive, responsive
 * Senior-grade system: scales with screen size, dark-ready, accessible
 */
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
export const isTablet = SCREEN_W >= 768;
export const isLarge = SCREEN_W >= 1024;

// Responsive helpers — scale gracefully, cap on tablet
const scale = (n: number) => Math.min(n * (SCREEN_W / 390), n * 1.25);
export const s = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

export const font = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  hero: isTablet ? 28 : 22,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
};

export const palette = {
  // Brand — deep red primary (from original) but refined
  primary: '#b91c1c',
  primaryDark: '#7f1d1d',
  primarySoft: '#fef2f2',
  primaryRing: 'rgba(185,28,28,0.12)',
  // Neutrals — warm gray scale (modern, not cold blue-gray)
  bg: '#fafaf9',
  surface: '#ffffff',
  surface2: '#f5f5f4',
  card: '#ffffff',
  cardSoft: '#f8fafc',
  border: '#e7e5e4',
  borderStrong: '#d6d3d1',
  text: '#1c1917',
  textMuted: '#78716c',
  textFaint: '#a8a29e',
  // Accent
  star: '#f59e0b',
  success: '#16a34a',
  // Shadow tuned for light bg
  shadow: 'rgba(28,25,23,0.08)',
  shadowStrong: 'rgba(28,25,23,0.12)',
};

export const shadow = {
  soft: {
    shadowColor: '#1c1917',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  medium: {
    shadowColor: '#1c1917',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  card: {
    shadowColor: '#1c1917',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};

export const contentMaxWidth = isTablet ? 720 : isLarge ? 860 : undefined;
export const horizontalPadding = isTablet ? 24 : 16;
