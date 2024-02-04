import { DEFAULT_FROM_EMAIL, ENV_RESEND_API_KEY, NODE_ENV } from '@/app/utils/config';
import { Resend } from 'resend';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams): Promise<{ data?: any; error?: any }> {
  // if (NODE_ENV === 'development') {
  //   console.log('Would send an email: ', params);
  //   return {};
  // }

  const resend = new Resend(ENV_RESEND_API_KEY);

  return resend.emails.send({ ...params, from: DEFAULT_FROM_EMAIL });
}
