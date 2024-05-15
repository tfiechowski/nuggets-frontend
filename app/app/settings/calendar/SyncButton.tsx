'use client';

import { GoogleCalendarService } from '@/app/utils/server/GoogleCalendarService';
import { UserMembership } from '@/app/utils/server/getUserTeam';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SyncButton({
  userMembership,
  onSync,
}: {
  userMembership: UserMembership;
  onSync: (userMembership: UserMembership) => {};
}) {
  async function handleSyncUpcoming() {
    try {
      await onSync(userMembership);
      toast.success('Sync succeeded!');
    } catch (error) {
      toast.error('Sync failed!');
      console.log('Calendar Events sync error:', error);
    }
  }

  return <Button onClick={handleSyncUpcoming}>Sync upcoming events</Button>;
}
