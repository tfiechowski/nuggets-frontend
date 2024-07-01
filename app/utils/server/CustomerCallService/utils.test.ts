import { filterEvents } from '@/app/utils/server/CustomerCallService/utils';

test('should filter attendees', async () => {
  const events = [
    {
      id: '1',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=MTlqN2tpZ201djNnczBpdmx0Y3BlNm5tdGsgdG9tYXN6LmZpZWNob3dza2lAbQ',
      created: '2024-05-15T20:25:43.000Z',
      updated: '2024-05-15T20:25:43.096Z',
      summary: 'New event',
      creator: {
        email: 'tomasz.fiechowski@gmail.com',
        self: true,
      },
      organizer: {
        email: 'tomasz.fiechowski@gmail.com',
        self: true,
      },
      start: {
        dateTime: '2024-05-15T22:45:00+02:00',
        timeZone: 'Europe/Warsaw',
      },
      end: {
        dateTime: '2024-05-15T23:15:00+02:00',
        timeZone: 'Europe/Warsaw',
      },
      iCalUID: '1@google.com',
      sequence: 0,
      attendees: [
        {
          email: 'tomasz@rota.works',
          responseStatus: 'needsAction',
        },
        {
          email: 'tomasz@wp.pl',
          responseStatus: 'needsAction',
        },
        {
          email: 'tomasz.fiechowski@getnuggets.io',
          organizer: true,
          self: true,
          responseStatus: 'accepted',
        },
      ],
      reminders: {
        useDefault: true,
      },
      eventType: 'default',
    },
    {
      id: '2',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=MTlqN2tpZ201djNnczBpdmx0Y3BlNm5tdGsgdG9tYXN6LmZpZWNob3dza2lAbQ',
      created: '2024-05-15T20:25:43.000Z',
      updated: '2024-05-15T20:25:43.096Z',
      summary: 'New event',
      creator: {
        email: 'tomasz.fiechowski@gmail.com',
        self: true,
      },
      organizer: {
        email: 'tomasz.fiechowski@gmail.com',
        self: true,
      },
      start: {
        dateTime: '2024-05-15T22:45:00+02:00',
        timeZone: 'Europe/Warsaw',
      },
      end: {
        dateTime: '2024-05-15T23:15:00+02:00',
        timeZone: 'Europe/Warsaw',
      },
      iCalUID: '2@google.com',
      sequence: 0,
      attendees: [
        {
          email: 'tomasz@getnuggets.io',
          responseStatus: 'needsAction',
        },
        {
          email: 'tomasz@nuggets.io',
          responseStatus: 'needsAction',
        },
        {
          email: 'mostafa@getnuggets.io',
          organizer: true,
          self: true,
          responseStatus: 'accepted',
        },
      ],
      reminders: {
        useDefault: true,
      },
      eventType: 'default',
    },
  ];
  expect(events.length).toEqual(2);

  const filteredEvents = filterEvents(events, ['@getnuggets.io', '@nuggets.io']);

  expect(filteredEvents.length).toEqual(1);
  const externalEvent = filteredEvents[0];
  expect(externalEvent.attendees?.some((attendee) => attendee.email === 'tomasz@rota.works'));
});

test('should filter daily event', () => {
  const events = [
    {
      kind: 'calendar#event',
      etag: '"3433614556160000"',
      id: '4nnu83ebn18dg65g9i1e4h5k89_20240731T081500Z',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=NG5udTgzZWJuMThkZzY1ZzlpMWU0aDVrODlfMjAyNDA3MzFUMDgxNTAwWiB0b21hc3ouZmllY2hvd3NraUBjb2RpbGl0eS5jb20',
      created: '2024-04-04T08:32:37.000Z',
      updated: '2024-05-27T10:54:38.080Z',
      summary: 'DX Daily',
      creator: { email: 'tomasz.fiechowski@codility.com', self: true },
      organizer: { email: 'tomasz.fiechowski@codility.com', self: true },
      start: { dateTime: '2024-07-31T10:15:00+02:00', timeZone: 'Europe/Warsaw' },
      end: { dateTime: '2024-07-31T10:30:00+02:00', timeZone: 'Europe/Warsaw' },
      recurringEventId: '4nnu83ebn18dg65g9i1e4h5k89_R20240522T081500',
      originalStartTime: { dateTime: '2024-07-31T10:15:00+02:00', timeZone: 'Europe/Warsaw' },
      iCalUID: '4nnu83ebn18dg65g9i1e4h5k89_R20240522T081500@google.com',
      sequence: 0,
      attendees: [
        { email: 'arlind.hoxha@codility.com', responseStatus: 'accepted' },
        { email: 'krzysztof.ebert@codility.com', responseStatus: 'accepted' },
        {
          email: 'maciej.gol@codility.com',
          responseStatus: 'declined',
          comment: 'Declined because I am out of office',
        },
        {
          email: 'tomasz.fiechowski@codility.com',
          organizer: true,
          self: true,
          responseStatus: 'accepted',
        },
      ],
      hangoutLink: 'https://meet.google.com/phr-nauq-rnb',
      conferenceData: {
        entryPoints: [
          {
            entryPointType: 'video',
            uri: 'https://meet.google.com/phr-nauq-rnb',
            label: 'meet.google.com/phr-nauq-rnb',
          },
          {
            entryPointType: 'more',
            uri: 'https://tel.meet/phr-nauq-rnb?pin=1664942086490',
            pin: '1664942086490',
          },
          {
            regionCode: 'PL',
            entryPointType: 'phone',
            uri: 'tel:+48-22-163-86-00',
            label: '+48 22 163 86 00',
            pin: '796815853',
          },
        ],
        conferenceSolution: {
          key: { type: 'hangoutsMeet' },
          name: 'Google Meet',
          iconUri:
            'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
        },
        conferenceId: 'phr-nauq-rnb',
      },
      reminders: { useDefault: true },
      eventType: 'default',
    },
  ];

  expect(events.length).toEqual(1);

  const filteredEvents = filterEvents(events, ['@codility.com']);

  expect(filteredEvents.length).toEqual(0);
});


test('should filter default ignored domains', () => {
  const events = [
    {
      kind: 'calendar#event',
      etag: '"3433614556160000"',
      id: '4nnu83ebn18dg65g9i1e4h5k89_20240731T081500Z',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=NG5udTgzZWJuMThkZzY1ZzlpMWU0aDVrODlfMjAyNDA3MzFUMDgxNTAwWiB0b21hc3ouZmllY2hvd3NraUBjb2RpbGl0eS5jb20',
      created: '2024-04-04T08:32:37.000Z',
      updated: '2024-05-27T10:54:38.080Z',
      summary: 'DX Daily',
      creator: { email: 'tomasz.fiechowski@codility.com', self: true },
      organizer: { email: 'tomasz.fiechowski@codility.com', self: true },
      start: { dateTime: '2024-07-31T10:15:00+02:00', timeZone: 'Europe/Warsaw' },
      end: { dateTime: '2024-07-31T10:30:00+02:00', timeZone: 'Europe/Warsaw' },
      recurringEventId: '4nnu83ebn18dg65g9i1e4h5k89_R20240522T081500',
      originalStartTime: { dateTime: '2024-07-31T10:15:00+02:00', timeZone: 'Europe/Warsaw' },
      iCalUID: '4nnu83ebn18dg65g9i1e4h5k89_R20240522T081500@google.com',
      sequence: 0,
      attendees: [
        { email: 'codility.com_hklcj2trhjp3k6qgguh3nqhks0@group.calendar.google.com', responseStatus: 'accepted' },
        { email: 'krzysztof.ebert@codility.com', responseStatus: 'accepted' },
        {
          email: 'maciej.gol@codility.com',
          responseStatus: 'declined',
          comment: 'Declined because I am out of office',
        },
        {
          email: 'tomasz.fiechowski@codility.com',
          organizer: true,
          self: true,
          responseStatus: 'accepted',
        },
      ],
      hangoutLink: 'https://meet.google.com/phr-nauq-rnb',
      conferenceData: {
        entryPoints: [
          {
            entryPointType: 'video',
            uri: 'https://meet.google.com/phr-nauq-rnb',
            label: 'meet.google.com/phr-nauq-rnb',
          },
          {
            entryPointType: 'more',
            uri: 'https://tel.meet/phr-nauq-rnb?pin=1664942086490',
            pin: '1664942086490',
          },
          {
            regionCode: 'PL',
            entryPointType: 'phone',
            uri: 'tel:+48-22-163-86-00',
            label: '+48 22 163 86 00',
            pin: '796815853',
          },
        ],
        conferenceSolution: {
          key: { type: 'hangoutsMeet' },
          name: 'Google Meet',
          iconUri:
            'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
        },
        conferenceId: 'phr-nauq-rnb',
      },
      reminders: { useDefault: true },
      eventType: 'default',
    },
  ];

  expect(events.length).toEqual(1);

  const filteredEvents = filterEvents(events, ['@codility.com']);

  expect(filteredEvents.length).toEqual(0);
});
