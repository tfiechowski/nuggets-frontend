import fs from 'fs/promises';
import { existsSync } from 'fs';
const path = require('path');
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { NEXT_PUBLIC_DEFAULT_URL } from '@/app/utils/config';
import {
  GoogleOAuth2Client,
  generateAuthUrl,
} from '@/app/utils/server/GoogleCalendarService/GoogleOAuthClient';

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
// // const CREDENTIALS_PATH =  './credentials.json';
// console.log('🚀 ~ CREDENTIALS_PATH:', CREDENTIALS_PATH);

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     console.log('No token.json file');
//     return null;
//   }
// }

// /**
//  * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client: any) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   console.log('Here');
//   console.log('File exists:', existsSync(CREDENTIALS_PATH));
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   console.log('Client', client);
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }

// /**
//  * Lists the next 10 events on the user's primary calendar.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// async function listEvents(auth: any) {
//   const calendar = google.calendar({ version: 'v3', auth });
//   const res = await calendar.events.list({
//     calendarId: 'primary',
//     timeMin: new Date().toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
//   });
//   const events = res.data.items;
//   if (!events || events.length === 0) {
//     console.log('No upcoming events found.');
//     return;
//   }
//   console.log('Upcoming 10 events:');
//   events.map((event, i) => {
//     const start = event.start.dateTime || event.start.date;
//     console.log(`${start} - ${event.summary}`);
//   });
// }

// async function main() {
//   'use server';

//   try {
//     const auth = await authorize();
//     console.log('🚀 ~ main ~ auth:', auth);
//     const events = await listEvents(auth);
//     console.log('🚀 ~ main ~ events:', events);
//     return { data: events, error: null };
//   } catch (error) {
//     console.log('🚀 ~ main ~ error:', error);
//     return { data: null, error };
//   }
// }

// --------------- NEW

async function main2() {
  'use server';

  return generateAuthUrl();
}

export default async function GoogleCalendarIntegrationPage() {
  // const { data: events, error } = await main();
  const url = await main2();

  return (
    <>
      Done!
      {/* <pre>{JSON.stringify({ events, error })}</pre> */}
      <a href={url}>Google Calendar Auth</a>
    </>
  );
}
