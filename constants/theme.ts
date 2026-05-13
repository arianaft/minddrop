import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    primary: '#7C9E87',      
    secondary: '#B5C9B7',    
    background: '#F5F0E8',   
    surface: '#FFFFFF',      // blanco  tarjetas
    text: '#2D3B2E',         
    textSecondary: '#6B7C6D',
    accent: '#D4A96A',       
    error: '#C0392B',        // rojo para errores
    border: '#E2DDD5',       
  },
  dark: {
    primary: '#7C9E87',      
    secondary: '#4A6B52',    
    background: '#1A2B1C',   
    surface: '#243326',      
    text: '#E8F0E9',         
    textSecondary: '#9AB09C',
    accent: '#D4A96A',      
    error: '#E74C3C',        
    border: '#2D3B2E',      
  },
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? colors.dark : colors.light;
}