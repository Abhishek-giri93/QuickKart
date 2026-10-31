/**
 * Environment Configuration
 *
 * Centralizes all environment variable access.
 * Validates required variables on startup.
 * Never import process.env directly elsewhere — always use this module.
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

/**
 * Validates that all required environment variables are set.
 * Throws an error on startup if any are missing.
 */
function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}\n` +
        `Please copy .env.example to .env and fill in the values.`
    );
  }
}

const config = {
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : ['http://localhost:3000', 'http://localhost:8081'],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_webhook_secret',
  },
};

export { config, validateEnv };

