import {
  DEFAULT_FROM_EMAIL,
  ENV_RESEND_API_KEY,
  ENV_RESEND_FORCE_EMAIL,
  NODE_ENV,
} from '@/app/utils/config';
import { Resend } from 'resend';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams): Promise<{ data?: any; error?: any }> {
  if ((NODE_ENV === 'development' || NODE_ENV === 'test') && !ENV_RESEND_FORCE_EMAIL) {
    console.log('Would send an email: ', params);
    return {};
  }

  const resend = new Resend(ENV_RESEND_API_KEY);

  return resend.emails.send({ ...params, from: DEFAULT_FROM_EMAIL });
}
