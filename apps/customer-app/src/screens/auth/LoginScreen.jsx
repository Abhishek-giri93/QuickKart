// Customer App — Login Screen (with Validation & Premium UX)
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
import { validatePhone, validateEmail, validatePassword } from '../../utils/validators';

const LoginScreen = ({ navigation, onLoginSuccess, onGoToRegister, onForgotPassword }) => {
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  
  // Field-specific validation errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Auto-detect whether user entered phone or email
  const isPhoneIdentifier = /^\d+$/.test(identifier.replace(/[\s-+()]/g, ''));

  const validateForm = () => {
    const newErrors = {};

    // Validate identifier (phone or email)
    if (!identifier.trim()) {
      newErrors.identifier = 'Mobile number or email is required';
    } else if (isPhoneIdentifier) {
      const phoneErr = validatePhone(identifier);
      if (phoneErr) newErrors.identifier = phoneErr;
    } else {
      const emailErr = validateEmail(identifier);
      if (emailErr) newErrors.identifier = emailErr;
    }

    // Validate password
    const passwordErr = validatePassword(password);
    if (passwordErr) {
      newErrors.password = passwordErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setGeneralError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call with 1s network latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // On success
      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (navigation?.replace) {
        navigation.replace('Home');
      }
    } catch (err) {
      setGeneralError('Invalid credentials. Please check your details and try again.');
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
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>🛒</Text>
          </View>
          <Text style={styles.title}>Welcome back to QuickKart</Text>
          <Text style={styles.subtitle}>Superfast food & grocery delivery in 15 minutes</Text>
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
            label="Mobile Number or Email"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: null }));
            }}
            placeholder="e.g. 9876543210 or name@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Text style={{ fontSize: 16 }}>📱</Text>}
            error={errors.identifier}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            placeholder="Enter your secret password"
            secureTextEntry
            leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
            error={errors.password}
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => onForgotPassword?.() || navigation?.navigate?.('ForgotPassword')}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            size="lg"
            style={{ marginTop: Spacing.sm }}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* OTP Quick Login */}
          <Button
            title="Quick Login with OTP 📲"
            variant="outline"
            size="md"
            onPress={() => alert('OTP login code sent to your registered mobile')}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to QuickKart? </Text>
          <TouchableOpacity
            onPress={() => onGoToRegister?.() || navigation?.navigate?.('Register')}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLink}>Create Account</Text>
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
    marginVertical: Spacing.xl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 107, 53, 0.25)',
  },
  logoText: {
    fontSize: 38,
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
    paddingHorizontal: 20,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
    paddingVertical: 4,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: FontSize.sm || 13,
    fontWeight: FontWeight.semiBold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.sm,
    color: Colors.text.tertiary,
    fontSize: FontSize.xs || 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  registerLink: {
    fontSize: FontSize.base || 14,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
});

export default LoginScreen;
