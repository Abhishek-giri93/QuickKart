// Customer App — Forgot Password Screen with Validation & OTP Simulation
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validatePhone, validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validators';

const ForgotPasswordScreen = ({ navigation, onGoToLogin }) => {
  const [step, setStep] = useState(1); // 1: Enter Phone/Email, 2: Enter OTP & New Password
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const isPhone = /^\d+$/.test(identifier.replace(/[\s-+()]/g, ''));

  const handleSendOtp = async () => {
    setGeneralError('');
    const newErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Mobile number or email is required';
    } else if (isPhone) {
      const err = validatePhone(identifier);
      if (err) newErrors.identifier = err;
    } else {
      const err = validateEmail(identifier);
      if (err) newErrors.identifier = err;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 800));
      setStep(2);
      Alert.alert('Verification Code Sent', 'Use demo OTP code: 1234');
    } catch (err) {
      setGeneralError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setGeneralError('');
    const newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = 'Verification code is required';
    } else if (otp.trim().length !== 4) {
      newErrors.otp = 'Please enter the 4-digit code (use 1234)';
    }

    const passErr = validatePassword(newPassword);
    if (passErr) newErrors.newPassword = passErr;

    const confirmErr = validateConfirmPassword(newPassword, confirmPassword);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      Alert.alert('Password Reset Successful! 🎉', 'You can now log in with your new password.', [
        { text: 'Log In', onPress: () => onGoToLogin?.() || navigation?.navigate?.('Login') },
      ]);
    } catch (err) {
      setGeneralError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step === 2 ? setStep(1) : onGoToLogin?.() || navigation?.navigate?.('Login'))}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 1 ? 'Reset Password 🔑' : 'Set New Password 🔒'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Enter your registered mobile or email to receive a 4-digit recovery code.'
              : `Enter the 4-digit OTP sent to ${identifier} and choose a new password.`}
          </Text>
        </View>

        {generalError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerIcon}>⚠️</Text>
            <Text style={styles.errorBannerText}>{generalError}</Text>
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.form}>
            <Input
              label="Registered Mobile or Email"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: null }));
              }}
              placeholder="e.g. 9876543210 or user@test.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Text style={{ fontSize: 16 }}>📱</Text>}
              error={errors.identifier}
            />

            <Button
              title="Send Verification Code"
              onPress={handleSendOtp}
              loading={loading}
              variant="primary"
              size="lg"
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="4-Digit Verification Code"
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                if (errors.otp) setErrors((prev) => ({ ...prev, otp: null }));
              }}
              placeholder="Enter 1234"
              keyboardType="number-pad"
              maxLength={4}
              leftIcon={<Text style={{ fontSize: 16 }}>🔢</Text>}
              error={errors.otp}
            />

            <Input
              label="New Password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: null }));
              }}
              placeholder="At least 6 chars with letters & numbers"
              secureTextEntry
              leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
              error={errors.newPassword}
            />

            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              placeholder="Re-enter your new password"
              secureTextEntry
              leftIcon={<Text style={{ fontSize: 16 }}>🔐</Text>}
              error={errors.confirmPassword}
            />

            <Button
              title="Update Password"
              onPress={handleResetPassword}
              loading={loading}
              variant="primary"
              size="lg"
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  backBtn: {
    paddingVertical: 8,
    marginBottom: Spacing.sm,
  },
  backBtnText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
  header: {
    marginVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl || 22,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: FontSize.sm || 13,
    color: Colors.text.secondary,
    marginTop: 6,
    lineHeight: 18,
  },
  form: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.errorLight || '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    marginBottom: Spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorBannerIcon: {
    fontSize: 16,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.status.error || '#DC2626',
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;

