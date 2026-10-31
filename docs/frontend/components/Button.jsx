// Button Component — Customer App
// Usage: <Button title="Add to Cart" onPress={handlePress} variant="primary" />

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { CustomerColors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

const Button = ({
  title,
  onPress,
  variant = 'primary',  // primary | secondary | outline | ghost | danger
  size = 'md',           // sm | md | lg
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.label,
    styles[`label_${variant}`],
    styles[`labelSize_${size}`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? CustomerColors.text.inverse : CustomerColors.primary}
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
  },

  // Variants
  primary: {
    backgroundColor: CustomerColors.primary,
  },
  secondary: {
    backgroundColor: CustomerColors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: CustomerColors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: CustomerColors.status.error,
  },

  // Sizes
  size_sm: { paddingVertical: Spacing.xxs, paddingHorizontal: Spacing.sm, height: 36 },
  size_md: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, height: 48 },
  size_lg: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl, height: 56 },

  // Disabled
  disabled: { opacity: 0.5 },

  // Label base
  label: {
    fontWeight: FontWeight.semiBold,
  },

  // Label by variant
  label_primary: { color: CustomerColors.text.inverse },
  label_secondary: { color: CustomerColors.text.inverse },
  label_outline: { color: CustomerColors.primary },
  label_ghost: { color: CustomerColors.primary },
  label_danger: { color: CustomerColors.text.inverse },

  // Label sizes
  labelSize_sm: { fontSize: FontSize.sm },
  labelSize_md: { fontSize: FontSize.base },
  labelSize_lg: { fontSize: FontSize.md },
});

export default Button;

