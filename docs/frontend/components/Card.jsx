// Card Component — Customer App
// Usage: <Card style={...}>{children}</Card>

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomerColors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

const Card = ({
  children,
  style,
  padding = 'md',  // none | sm | md | lg
  elevation = 'sm', // none | xs | sm | md | lg
  radius = 'sm',    // xs | sm | md | lg
}) => {
  return (
    <View
      style={[
        styles.card,
        Shadow[elevation],
        { borderRadius: BorderRadius[radius] },
        padding !== 'none' && styles[`padding_${padding}`],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CustomerColors.surface,
    overflow: 'hidden',
  },
  padding_sm: { padding: Spacing.xs },
  padding_md: { padding: Spacing.md },
  padding_lg: { padding: Spacing.xl },
});

export default Card;

