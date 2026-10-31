// QuickKart Design System — Typography

export const FontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 32,
};

export const FontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Predefined text styles for consistency
export const TextStyles = {
  h1: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, lineHeight: FontSize.xxxl * 1.2 },
  h2: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, lineHeight: FontSize.xxl * 1.2 },
  h3: { fontSize: FontSize.xl, fontWeight: FontWeight.semiBold, lineHeight: FontSize.xl * 1.3 },
  h4: { fontSize: FontSize.lg, fontWeight: FontWeight.semiBold, lineHeight: FontSize.lg * 1.3 },
  h5: { fontSize: FontSize.md, fontWeight: FontWeight.semiBold, lineHeight: FontSize.md * 1.4 },
  bodyLarge: { fontSize: FontSize.base, fontWeight: FontWeight.regular, lineHeight: FontSize.base * 1.5 },
  bodyMedium: { fontSize: FontSize.sm, fontWeight: FontWeight.regular, lineHeight: FontSize.sm * 1.5 },
  bodySmall: { fontSize: FontSize.xs, fontWeight: FontWeight.regular, lineHeight: FontSize.xs * 1.5 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, lineHeight: FontSize.sm * 1.4 },
  caption: { fontSize: FontSize.xs, fontWeight: FontWeight.regular, lineHeight: FontSize.xs * 1.4 },
  button: { fontSize: FontSize.base, fontWeight: FontWeight.semiBold, lineHeight: FontSize.base * 1.2 },
  buttonSmall: { fontSize: FontSize.sm, fontWeight: FontWeight.semiBold, lineHeight: FontSize.sm * 1.2 },
};

