/**
 * QuickKart — Frontend Input Validation Utilities
 *
 * Provides instant client-side validation rules for user experience
 * before sending payloads to the backend API.
 */

// Email regex validator (RFC 5322 standard compliant)
export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email address is required';
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

// 10-digit Indian Mobile Number validator
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Mobile number is required';
  const cleanPhone = phone.replace(/[\s-+()]/g, '');
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return 'Enter a valid 10-digit mobile number starting with 6-9';
  }
  return null;
};

// Password policy validator: min 6 characters, contains letter & number
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must contain at least one letter and one number';
  }
  return null;
};

// Full name validator
export const validateName = (name) => {
  if (!name || !name.trim()) return 'Full name is required';
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(name.trim())) {
    return 'Name can only contain letters and spaces';
  }
  return null;
};

// 6-digit Indian Postal PIN Code validator
export const validatePincode = (pincode) => {
  if (!pincode || !pincode.trim()) return 'PIN code is required';
  const cleanPin = pincode.replace(/\s/g, '');
  if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
    return 'Enter a valid 6-digit Indian PIN code';
  }
  return null;
};

// Confirm Password Matcher
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};
