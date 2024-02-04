'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/registry/new-york/ui/button';
import { useState } from 'react';

import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { UserInviteForm } from '@/app/app/team/members/UserInviteForm';

const userInviteFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled' })
    .email('This is not a valid email'),
  role: z.enum(['member', 'owner']),
});

export function UserInviteDialog({}: {}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  async function handleInvite(
    values: z.infer<typeof userInviteFormSchema>
  ): Promise<{ error?: any; data?: any }> {
    const response = await fetch('/api/teams/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const body = await response.json();

    return body;
  }

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
        <UserInviteForm onInvite={handleInvite} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
