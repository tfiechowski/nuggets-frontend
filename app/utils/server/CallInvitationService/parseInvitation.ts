// This could be actually done on Vercel side with the ical library for handling
// the ical files in a proper manner, instead of these regexps :D

import { ZoomCall, parseZoomUrl } from '@/app/utils/server/CallInvitationService/providers/zoom';
import * as ICAL from 'node-ical';

interface Data {
  attachment: string;
}

interface InvitationData {
  end: string;
  organizer: string;
  start: string;
  timezone: string;
  title: string;
  uid: string;
  zoomCall: ZoomCall;
}

function parseOrganizer(organizerIcalString: string): string {
  const regex = /mailto:(.*)/gm;

  // const matches = organizerIcalString.matchAll(regex);
  const matches = regex.exec(organizerIcalString);

  if (matches === null) {
    throw new Error(`Cannot parse invitation organizer: ${organizerIcalString}`);
  }

  return matches[1];
}

export function parseInvitation(content: string): InvitationData {
  const x = ICAL.parseICS(content);
  // console.log("\n\n\tData:", JSON.stringify(x, null, 2));

  const events = Object.values(x).filter((a) => a.type === 'VEVENT') as Array<ICAL.VEvent>;
  const timezones = Object.values(x).filter((a) => a.type === 'VTIMEZONE') as Array<ICAL.VTimeZone>;

  if (events.length > 1) {
    console.warn('More than one event!');
  }

  if (timezones.length > 1) {
    console.warn('More than one timezone!');
  }

  const event = events[0];
  const timezone = timezones[0];

  const organizer = parseOrganizer((event.organizer as any)['val']);

  const uid = event.uid;
  const timezoneId = timezone.tzid;
  const start = event.start.toISOString();
  const end = event.end.toISOString();
  const title = event.summary;
  const { zoomCallId, zoomCallPassword, zoomCustomerDomain } = parseZoomUrl(event.location);
  const zoomCallUrl = event.location;

  return {
    zoomCall: {
      customerDomain: zoomCustomerDomain,
      id: zoomCallId,
      password: zoomCallPassword,
      url: zoomCallUrl,
    },
    organizer,
    timezone: timezoneId,
    uid,
    start,
    end,
    title,
  };
}

export async function processInvitation(data: Data): Promise<InvitationData> {
  const { attachment } = data;

  const invite = await fetch(attachment);

  const ret = parseInvitation(await invite.text());

  return ret;
}
