'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/registry/new-york/ui/button';
import { useState } from 'react';

import { toast } from 'sonner';

import { UserInviteForm } from '@/app/app/team/members/UserInviteForm';
import { TeamInvitationService } from '@/app/utils/client/TeamInvitationService';
import { useRouter } from 'next/navigation';

export function UserInviteDialog({}: {}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  function handleSuccess() {
    toast.success('Invitation sent!');
    router.refresh();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Invite</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <UserInviteForm
          onInvite={TeamInvitationService.inviteUserToTeam}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
