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
          // TODO: extract to true dependency injection or API context in the future
          // Maybe even use the API Context in the form itself?
          // Like, this form is very specifc and will not be reused
          // so maybe there is no point in having a specific Dialog here as well
          // which is just passing a proper API method below
          // However, eg. this Dialog could be a generic one,
          // given form eg (Form and FormInner components) gets
          // its api inside
          onInvite={TeamInvitationService.inviteUserToTeam}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
