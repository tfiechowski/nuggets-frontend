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
export const PUBLIC_NEXT_VERCEL_ENV = VERCEL_ENV;

export const NEXT_PUBLIC_DEFAULT_URL =
  PUBLIC_NEXT_VERCEL_ENV === 'production' ? 'https://getnuggets.io' : 'http://localhost:3000';

export const ENV_RESEND_FORCE_EMAIL = process.env.ENV_RESEND_FORCE_EMAIL;

export const ENV_WEBHOOK_ENDPOINT =
  NODE_ENV === 'production'
    ? NEXT_PUBLIC_DEFAULT_URL
    : 'https://f775-213-134-186-96.ngrok-free.app';

export const GOOGLE_NOTIFICATIONS_TTL = NODE_ENV === 'production' ? 604800 : 600;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
