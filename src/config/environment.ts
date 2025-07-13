export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 30000,
  },
  ai: {
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    maxTokens: 4000,
  },
  pdf: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
} as const;

// Validate required environment variables
export const validateEnvironment = () => {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'GOOGLE_API_KEY',
    'GEMINI_MODEL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}; 