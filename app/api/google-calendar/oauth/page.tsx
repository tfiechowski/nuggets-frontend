import { redirect } from 'next/navigation';
import { GoogleOAuth2Client } from '@/app/utils/server/GoogleCalendarService/GoogleOAuthClient';
import { prisma } from '@/lib/db';
import { getUserId } from '@/app/utils/server/getUserId';
import { NEXT_PUBLIC_DEFAULT_URL } from '@/app/utils/config';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { UserMembership, getUserMembership } from '@/app/utils/server/getUserTeam';

function getToken(userMembership: UserMembership, code: string) {
  return new Promise<{ error?: any; refreshToken?: string }>((resolve, reject) => {
    GoogleOAuth2Client().getToken(code, async (err, tokens, res) => {
      console.log('getToken response', res);
      if (err) {
        console.log('server 39 | error', err);
        return resolve({ error: `Issue with Login: ${err.message}` });
      }

      if (tokens === null || tokens === undefined) {
        console.log('No tokens:', tokens);
        return resolve({ error: 'No tokens' });
      }

      const refreshToken = tokens.refresh_token;

      if (refreshToken === null || refreshToken === undefined) {
        return resolve({ error: 'No refresh token' });
      }

      console.log('🚀 ~ GoogleOAuth2Client ~ refreshToken:', refreshToken);

      await prisma.googleCalendarIntegration.upsert({
        create: {
          refreshToken,
          membershipId: userMembership.membershipId,
        },
        update: {
          refreshToken,
        },
        where: {
          membershipId: userMembership.membershipId,
        },
      });

      resolve({});

      // Change the slashes to something that don't breakes the URL
    });
  });
}

export default async function GoogleOauthRedirectPage({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const { code } = searchParams;
  const userMembership = await getUserMembership();

  console.log('Getting token with code:', code, ' for user:', userMembership.membershipId);
  const { error } = await getToken(userMembership, code);

  if (error) {
    console.log('🚀 ~ error on redirect:', error);
    return <div>Error happened: {JSON.stringify(error)}</div>;
  }

  redirect(`${NEXT_PUBLIC_DEFAULT_URL}/api/google-calendar/watch`);

  return <div>GoogleOauthRedirectPage ... {searchParams.code}</div>;
}

// app/api/google-calendar/oauth/page.tsx
// http://localhost:3000/app/api/google-calendar/oauth
