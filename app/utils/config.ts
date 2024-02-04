export const DEFAULT_FROM_EMAIL = 'tomasz@breezeflow.eu';

function getEnvKey(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
}

export const ENV_RESEND_API_KEY = getEnvKey('RESEND_API_KEY');
