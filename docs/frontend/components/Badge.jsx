// Badge Component — Customer App
// Usage: <Badge label="New" variant="success" />

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomerColors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

const Badge = ({
  label,
  variant = 'primary', // primary | success | error | warning | info | neutral
  size = 'md',          // sm | md
  style,
}) => {
  return (
    <View style={[styles.badge, styles[variant], styles[`size_${size}`], style]}>
      <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.xs,
  },

  // Variants (background)
  primary: { backgroundColor: CustomerColors.primary + '20' },
  success: { backgroundColor: CustomerColors.status.successLight },
  error: { backgroundColor: CustomerColors.status.errorLight },
  warning: { backgroundColor: CustomerColors.status.warningLight },
  info: { backgroundColor: CustomerColors.status.infoLight },
  neutral: { backgroundColor: CustomerColors.surfaceSecondary },

  // Sizes
  size_sm: { paddingVertical: 2 },
  size_md: { paddingVertical: Spacing.xxs },

  // Label base
  label: { fontWeight: FontWeight.semiBold },

  // Label colors
  label_primary: { color: CustomerColors.primary },
  label_success: { color: CustomerColors.status.success },
  label_error: { color: CustomerColors.status.error },
  label_warning: { color: CustomerColors.status.warning },
  label_info: { color: CustomerColors.status.info },
  label_neutral: { color: CustomerColors.text.secondary },

  // Label sizes
  labelSize_sm: { fontSize: FontSize.xs },
  labelSize_md: { fontSize: FontSize.sm },
});

export default Badge;

