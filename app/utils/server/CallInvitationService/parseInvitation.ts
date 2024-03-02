// This could be actually done on Vercel side with the ical library for handling
// the ical files in a proper manner, instead of these regexps :D

import * as ICAL from 'node-ical';

interface Data {
  attachment: string;
}

interface ZoomCall {
  id: string;
  password: string;
  url: string;
  customerDomain: string;
}

interface InvitationData {
  end: string;
  organizer: string;
  start: string;
  timezone: string;
  uid: string;
  zoomCall: ZoomCall;
}

function parseZoomUrl(zoomUrl: string): {
  zoomCallId: string;
  zoomCallPassword: string;
  zoomCustomerDomain: string;
} {
  let zoomCallPassword = '';
  let zoomCallId = '';
  let zoomCustomerDomain = '';

  const regex = /https:\/\/(.*)\.zoom\.us\/j\/([0-9]+)\?pwd=([a-zA-Z0-9\.]{1,32})/gm;
  let m;

  while ((m = regex.exec(zoomUrl)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        zoomCustomerDomain = match;
      } else if (groupIndex === 2) {
        zoomCallId = match;
      } else if (groupIndex === 3) {
        zoomCallPassword = match;
      }
    });
  }

  return {
    zoomCallId,
    zoomCallPassword,
    zoomCustomerDomain,
  };
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

  let uid = event.uid;
  let timezoneId = timezone.tzid;
  let start = event.start.toISOString();
  let end = event.end.toISOString();
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
  };
}

export async function processInvitation(data: Data): Promise<InvitationData> {
  const { attachment } = data;

  const invite = await fetch(attachment);

  const ret = parseInvitation(await invite.text());

  return ret;
}
