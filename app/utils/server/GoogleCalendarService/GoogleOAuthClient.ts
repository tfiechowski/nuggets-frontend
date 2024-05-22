import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXT_PUBLIC_DEFAULT_URL,
} from '@/app/utils/config';
import { google } from 'googleapis';

const redirectUri = encodeURI(NEXT_PUBLIC_DEFAULT_URL + '/api/google-calendar/oauth');

export const GoogleOAuth2Client = () =>
  new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri);
console.log("🚀 ~ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri:", GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectUri)

/*
Possibly needed for watch:
'https://www.googleapis.com/auth/calendar',
'https://www.googleapis.com/auth/calendar.events',
'https://www.googleapis.com/auth/calendar.events.readonly',
'https://www.googleapis.com/auth/calendar.readonly',
*/

export function generateAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.events.readonly',
  ];
  console.log('🚀 ~ generateAuthUrl ~ redirectUri:', redirectUri);

  const authorizationUrl = GoogleOAuth2Client().generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    redirect_uri: redirectUri,
  });

  return authorizationUrl;
}

export const GoogleCalendar = google.calendar({
  version: 'v3',
  auth: GoogleOAuth2Client(),
});
