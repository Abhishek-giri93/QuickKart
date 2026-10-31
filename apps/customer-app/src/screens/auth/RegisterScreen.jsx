// Customer App — Register Screen (with Validation & Real-time Feedback)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validators';

const RegisterScreen = ({ navigation, onRegisterSuccess, onGoToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    const nameErr = validateName(fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const phoneErr = validatePhone(phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;

    const confirmErr = validateConfirmPassword(password, confirmPassword);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    if (!agreedToTerms) {
      newErrors.terms = 'Please accept the Terms of Service to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setGeneralError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call with 1s network latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else if (navigation?.replace) {
        navigation.replace('Home');
      }
    } catch (err) {
      setGeneralError('Registration failed. Please check your network and try again.');
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
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create QuickKart Account 🛍️</Text>
          <Text style={styles.subtitle}>Sign up to order food, groceries and daily needs</Text>
        </View>

        {/* Global Error Banner */}
        {generalError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerIcon}>⚠️</Text>
            <Text style={styles.errorBannerText}>{generalError}</Text>
          </View>
        ) : null}

        {/* Form Fields */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
            }}
            placeholder="e.g. Abhishek Giri"
            autoCapitalize="words"
            leftIcon={<Text style={{ fontSize: 16 }}>👤</Text>}
            error={errors.fullName}
          />

          <Input
            label="Mobile Number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
            }}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            leftIcon={<Text style={{ fontSize: 16 }}>📱</Text>}
            error={errors.phone}
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            placeholder="e.g. name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Text style={{ fontSize: 16 }}>✉️</Text>}
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            placeholder="At least 6 chars with letters & numbers"
            secureTextEntry
            leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
            }}
            placeholder="Re-enter your password"
            secureTextEntry
            leftIcon={<Text style={{ fontSize: 16 }}>🔐</Text>}
            error={errors.confirmPassword}
          />

          {/* Terms checkbox row */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to QuickKart's{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && <Text style={styles.termsError}>{errors.terms}</Text>}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            variant="primary"
            size="lg"
            style={{ marginTop: Spacing.md }}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => onGoToLogin?.() || navigation?.navigate?.('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl || 22,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm || 13,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 6,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  termsError: {
    fontSize: 12,
    color: Colors.status.error,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.base || 14,
    color: Colors.text.secondary,
  },
  loginLink: {
    fontSize: FontSize.base || 14,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
});

export default RegisterScreen;

