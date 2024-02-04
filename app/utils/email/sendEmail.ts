import { DEFAULT_FROM_EMAIL, ENV_RESEND_API_KEY } from '@/app/utils/config';
import { Resend } from 'resend';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export function sendEmail(params: SendEmailParams) {
  console.log('🚀 ~ sendEmail ~ ENV_RESEND_API_KEY:', ENV_RESEND_API_KEY);
  const resend = new Resend(ENV_RESEND_API_KEY);

  return resend.emails.send({ ...params, from: DEFAULT_FROM_EMAIL });
}
