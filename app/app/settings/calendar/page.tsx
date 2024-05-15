import { SyncButton } from '@/app/app/settings/calendar/SyncButton';
import { GoogleCalendarService } from '@/app/utils/server/GoogleCalendarService';
import { UserMembership, getUserMembership } from '@/app/utils/server/getUserTeam';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function handleSync(userMembership: UserMembership) {
  'use server';

  return GoogleCalendarService.syncUpcomingEvents(userMembership);
}

export default async function GoogleCalendarIntegrationPage() {
  const userMemberhip = await getUserMembership();
  const isUserIntegrated = await GoogleCalendarService.isUserIntegrated(userMemberhip);
  const isUserCalendarSynced = await GoogleCalendarService.isUserCalendarSynced(userMemberhip);

  if (!isUserIntegrated) {
    const authUrl = await GoogleCalendarService.generateAuthUrl();

    return (
      <div>
        Not integrated!
        <div className="mt-8">
          <Button asChild>
            <Link href={authUrl}>Integrate with Google Calendar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>You are integrated with Google Calendar!</div>

      <div>
        <SyncButton userMembership={userMemberhip} onSync={handleSync} />
      </div>

      {isUserCalendarSynced ? <div>Synced</div> : <div>No</div>}
    </div>
  );
}
