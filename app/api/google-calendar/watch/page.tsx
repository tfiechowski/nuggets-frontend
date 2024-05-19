import { NEXT_PUBLIC_DEFAULT_URL } from '@/app/utils/config';
import { GoogleCalendarService } from '@/app/utils/server/GoogleCalendarService';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { redirect } from 'next/navigation';

export default async function GoogleEvents() {
  const userMembership = await getUserMembership();

  await GoogleCalendarService.refreshEventsWatch(userMembership, true);
  await GoogleCalendarService.runCalendarSync(userMembership);

  const redirectUrl = `${NEXT_PUBLIC_DEFAULT_URL}/app/settings/calendar`;
  console.log(
    `Calendar Sync is done for ${userMembership.membershipId}, redirecting to ${redirectUrl}`
  );

  return redirect(redirectUrl);
}
