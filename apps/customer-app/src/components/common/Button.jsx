// Reusable Button Component — Customer App
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | ghost | danger
  size = 'md',          // sm | md | lg
  loading = false,
  disabled = false,
  icon,
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
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={labelStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md || 10,
    flexDirection: 'row',
    gap: 8,
  },
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  secondary: {
    backgroundColor: Colors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.status.error,
  },
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm || 12,
    height: 38,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.md || 16,
    height: 50,
  },
  size_lg: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl || 24,
    height: 56,
  },
  disabled: {
    opacity: 0.55,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontWeight: FontWeight.bold || '700',
    letterSpacing: 0.2,
  },
  label_primary: { color: '#FFFFFF' },
  label_secondary: { color: '#FFFFFF' },
  label_outline: { color: Colors.primary },
  label_ghost: { color: Colors.primary },
  label_danger: { color: '#FFFFFF' },

  labelSize_sm: { fontSize: FontSize.sm || 13 },
  labelSize_md: { fontSize: FontSize.base || 15 },
  labelSize_lg: { fontSize: FontSize.md || 17 },
});

export default Button;

