import dotenv from 'dotenv';
dotenv.config();

/**
 * Application configuration
 * All environment variables and settings are managed here
 */
export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || '',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Admin Authentication
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  
  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 12,
    maxLimit: 100,
  },
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default config;
