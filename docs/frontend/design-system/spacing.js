// QuickKart Design System — Spacing, Radius, Shadows

// Base unit: 4px
export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,     // Cards, inputs
  md: 12,    // Modals, sheets
  lg: 16,
  xl: 20,
  pill: 999, // Badges, chips, round buttons
  circle: 9999,
};

export const Shadow = {
  none: {},
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const ZIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  overlay: 200,
  modal: 300,
  toast: 400,
};

