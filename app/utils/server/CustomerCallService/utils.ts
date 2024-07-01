import { calendar_v3 } from 'googleapis';

const DEFAULT_IGNORED_DOMAINS = ['@group.calendar.google.com'];

export function filterEvents(
  events: Array<calendar_v3.Schema$Event>,
  customerEmailDomains: Array<string>
) {
  const ignoredDomains = [...DEFAULT_IGNORED_DOMAINS, ...customerEmailDomains];

  // TODO: Improve efficiency here by creating a helper to apply skips per event
  // inside a single filter function, not calling filter multiple times
  const skipNoIds = (event: calendar_v3.Schema$Event) => Boolean(event.id);
  const skipFullDayEvents = (event: calendar_v3.Schema$Event) => Boolean(event.start?.dateTime);
  const skipNoAttendees = (event: calendar_v3.Schema$Event) => event.attendees?.length;
  const skipInternalMeetings = (event: calendar_v3.Schema$Event) =>
    !event.attendees?.every((attendee) =>
      ignoredDomains.some((ignoredDomain) => attendee.email?.endsWith(ignoredDomain))
    );

  return events
    .filter(skipNoIds)
    .filter(skipNoAttendees)
    .filter(skipFullDayEvents)
    .filter((event) => skipInternalMeetings(event));
}
