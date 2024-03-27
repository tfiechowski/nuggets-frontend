export const DEFAULT_FROM_EMAIL = 'tomasz@getnuggets.io';

export function getEnvKey(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
}

export const ENV_RESEND_API_KEY = process.env.RESEND_API_KEY;

export const NODE_ENV = process.env.NODE_ENV || 'production';

export const VERCEL_ENV = process.env.VERCEL_ENV || 'production';

export const NEXT_PUBLIC_DEFAULT_URL =
  VERCEL_ENV === 'production' ? 'https://getnuggets.io' : 'http://localhost:3000';

export const ENV_RESEND_FORCE_EMAIL = process.env.ENV_RESEND_FORCE_EMAIL;
