import { parseInvitation } from './parseInvitation';

const ics = `BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VTIMEZONE
TZID:Europe/Warsaw
X-LIC-LOCATION:Europe/Warsaw
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTART;TZID=Europe/Warsaw:20240227T120000
DTEND;TZID=Europe/Warsaw:20240227T133000
DTSTAMP:20240226T203055Z
ORGANIZER;CN=Tomek Fiechowski:mailto:tomasz.fiechowski@gmail.com
UID:2l7ou52uerottd2083ald2adr4@google.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=
 TRUE;CN=help.bt6qt0@zapiermail.com;X-NUM-GUESTS=0:mailto:help.bt6qt0@zapier
 mail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE
 ;CN=Tomek Fiechowski;X-NUM-GUESTS=0:mailto:tomasz.fiechowski@gmail.com
X-MICROSOFT-CDO-OWNERAPPTID:-201505552
CREATED:20240226T191808Z
DESCRIPTION:<p><br>──────────<br><br>Hi there\, <br><br>Tomasz Fiechowski i
 s inviting you to a scheduled Zoom meeting. <br><br>Join from PC\, Mac\, Li
 nux\, iOS or Android: https://codility.zoom.us/j/87001546565?pwd=kjMeiVdTzp
 v3wUwbJuwvpMbUq3qzRU.1<br>    Password: 226197<br><br>Or iPhone one-tap :<b
 r>    US: +13602095623\,\,87001546565#  or +13863475053\,\,87001546565# <br
 >Or Telephone:<br>    Dial(for higher quality\, dial a number based on your
  current location): <br>        US: +1 360 209 5623  or +1 386 347 5053  or
  +1 408 638 0968  or +1 507 473 4847  or +1 564 217 2000  or +1 646 876 992
 3  or +1 646 931 3860  or +1 669 444 9171  or +1 669 900 6833  or +1 689 27
 8 1000  or +1 719 359 4580  or +1 253 205 0468  or +1 253 215 8782  or +1 3
 01 715 8592  or +1 305 224 1968  or +1 309 205 3325  or +1 312 626 6799  or
  +1 346 248 7799 <br>    Meeting ID: 870 0154 6565<br>    International num
 bers available: https://codility.zoom.us/u/kdC22zusp3<br><br><br><br>──────
 ────</p>
LAST-MODIFIED:20240226T203054Z
LOCATION:https://codility.zoom.us/j/87001546565?pwd=kjMeiVdTzpv3wUwbJuwvpMb
 Uq3qzRU.1
SEQUENCE:5
STATUS:CONFIRMED
SUMMARY:Tomasz Fiechowski's Zoom Meeting
TRANSP:OPAQUE
BEGIN:VALARM
ACTION:EMAIL
DESCRIPTION:This is an event reminder
SUMMARY:Alarm notification
ATTENDEE:mailto:help.bt6qt0@zapiermail.com
TRIGGER:-P0DT0H10M0S
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:This is an event reminder
TRIGGER:-P0DT0H30M0S
END:VALARM
END:VEVENT
END:VCALENDAR
`;

test('parse organizer email', () => {
  const result = parseInvitation(ics);

  expect(result.organizer).toBe('tomasz.fiechowski@gmail.com');
});

test('parse zoom call ID', () => {
  const result = parseInvitation(ics);

  expect(result.zoomCall.id).toBe('87001546565');
});

test('parse zoom call password', () => {
  const result = parseInvitation(ics);

  expect(result.zoomCall.password).toBe('kjMeiVdTzpv3wUwbJuwvpMbUq3qzRU.1');
});

test('parse zoom customer domain', () => {
  const result = parseInvitation(ics);

  expect(result.zoomCall.customerDomain).toBe('codility');
});

test('parse zoom call url', () => {
  const result = parseInvitation(ics);

  expect(result.zoomCall.url).toBe(
    'https://codility.zoom.us/j/87001546565?pwd=kjMeiVdTzpv3wUwbJuwvpMbUq3qzRU.1'
  );
});

test('parse timezone name', () => {
  const result = parseInvitation(ics);

  expect(result.timezone).toBe('Europe/Warsaw');
});

test('parse uid', () => {
  const result = parseInvitation(ics);

  expect(result.uid).toBe('2l7ou52uerottd2083ald2adr4@google.com');
});

test('parse start', () => {
  const result = parseInvitation(ics);

  expect(result.start).toBe('2024-02-27T11:00:00.000Z');
});

test('parse end', () => {
  const result = parseInvitation(ics);

  expect(result.end).toBe('2024-02-27T12:30:00.000Z');
});
