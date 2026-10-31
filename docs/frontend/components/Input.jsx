// Input Component — Customer App
// Usage: <Input label="Email" value={email} onChangeText={setEmail} />

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomerColors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const containerBorderColor = error
    ? CustomerColors.status.error
    : isFocused
    ? CustomerColors.primary
    : CustomerColors.border;

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, { borderColor: containerBorderColor }]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, multiline && styles.multiline, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={CustomerColors.text.tertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },

  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: CustomerColors.text.primary,
    marginBottom: Spacing.xxs,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.sm,
    backgroundColor: CustomerColors.surface,
    paddingHorizontal: Spacing.sm,
    minHeight: 48,
  },

  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: CustomerColors.text.primary,
    paddingVertical: Spacing.xs,
  },

  multiline: {
    textAlignVertical: 'top',
    minHeight: 100,
  },

  leftIcon: { marginRight: Spacing.xs },
  rightIcon: { marginLeft: Spacing.xs },
  eyeIcon: { fontSize: 18 },

  errorText: {
    fontSize: FontSize.xs,
    color: CustomerColors.status.error,
    marginTop: 4,
  },

  hintText: {
    fontSize: FontSize.xs,
    color: CustomerColors.text.tertiary,
    marginTop: 4,
  },
});

export default Input;

