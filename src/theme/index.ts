import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { palette } from './tokens';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    primaryContainer: palette.primarySoft,
    background: palette.bg,
    surface: palette.surface,
    outline: palette.border,
  },
  roundness: 14,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#ef4444',
    background: '#1c1917',
    surface: '#292524',
  },
  roundness: 14,
};

export * from './tokens';
