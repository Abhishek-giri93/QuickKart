// Customer App — Login Screen

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

// Components (will be moved to components/common/)
const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType }) => {
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={inputStyles.inputBox}>
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.tertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
        />
      </View>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('Please fill all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with real authService.login() call
      await new Promise((r) => setTimeout(r, 1000)); // mock delay
      // On success: useAuthStore.login(user, token)
      navigation.replace('MainNavigator'); // temporary
    } catch (e) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🛒</Text>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Login to continue shopping</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <Input
            label="Mobile Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* OTP Login */}
          <TouchableOpacity style={styles.otpBtn}>
            <Text style={styles.otpBtnText}>Login with OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const inputStyles = StyleSheet.create({
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text.primary, marginBottom: 6 },
  inputBox: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.sm, height: 48, justifyContent: 'center',
  },
  input: { fontSize: FontSize.base, color: Colors.text.primary },
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: Spacing.xl },
  header: { alignItems: 'center', marginTop: Spacing.huge, marginBottom: Spacing.xxl },
  logo: { fontSize: 52, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text.primary },
  subtitle: { fontSize: FontSize.base, color: Colors.text.secondary, marginTop: 6 },
  form: { flex: 1 },
  errorBanner: {
    backgroundColor: Colors.status.errorLight, color: Colors.status.error,
    borderRadius: BorderRadius.sm, padding: Spacing.sm, marginBottom: Spacing.md,
    fontSize: FontSize.sm,
  },
  forgotText: { color: Colors.primary, fontSize: FontSize.sm, textAlign: 'right', marginBottom: Spacing.lg },
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.sm,
    height: 52, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xs,
  },
  loginBtnText: { color: '#FFF', fontSize: FontSize.base, fontWeight: FontWeight.semiBold },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: Spacing.sm, color: Colors.text.tertiary, fontSize: FontSize.sm },
  otpBtn: {
    borderWidth: 1.5, borderColor: Colors.primary, borderRadius: BorderRadius.sm,
    height: 52, alignItems: 'center', justifyContent: 'center',
  },
  otpBtnText: { color: Colors.primary, fontSize: FontSize.base, fontWeight: FontWeight.semiBold },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: Spacing.xl },
  footerText: { fontSize: FontSize.base, color: Colors.text.secondary },
  registerLink: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.semiBold },
});

export default LoginScreen;

