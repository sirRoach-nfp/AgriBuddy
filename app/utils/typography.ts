// typography.js
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Helper to clamp a value between min and max
const clamp = (min:any, value:any, max:any) => Math.min(Math.max(value, min), max);

// Helper to get scaled font size based on screen width
const getFontSize = (base:any, min = base - 2, max = base + 4) => {
  const scaled = base * (width / 375); // 375 = iPhone X baseline
  return clamp(min, scaled, max);
};

export const fonts = {
  h1: {
    fontSize: getFontSize(28, 26, 32),
    fontWeight: '800' as const,
  },
  h2: {
    fontSize: getFontSize(22, 20, 24),
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: getFontSize(19, 18, 20),
    fontWeight: '600' as const,
  },
  body: {
    fontSize: getFontSize(15, 14, 16),
    fontWeight: '400' as const,
  },
  bodySecondary: {
    fontSize: getFontSize(13, 12, 14),
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: getFontSize(11, 10, 12),
    fontWeight: '400' as const,
  },
  buttonPrimary: {
    fontSize: getFontSize(15, 14, 16),
    fontWeight: '600' as const,
  },
  buttonSecondary: {
    fontSize: getFontSize(13, 12, 14),
    fontWeight: '500' as const,
  },
  inputLabel: {
    fontSize: getFontSize(13, 12, 14),
    fontWeight: '500' as const,
  },
  error: {
    fontSize: getFontSize(13, 12, 14),
    fontWeight: '500' as const,
    color: 'red',
  },

  eyebrowText:{
    fontSize: getFontSize(18, 16, 19),
    fontWeight: '700' as const,
  },

  headerPrimary:{},
  headerSecondary:{
    fontSize: getFontSize(16, 15, 17),
    fontWeight: '600' as const,
    color:'#37474F'
  },
  headerTertiary:{
    
  },

  //Account screen 
  //---> summary cards typo
 
};
