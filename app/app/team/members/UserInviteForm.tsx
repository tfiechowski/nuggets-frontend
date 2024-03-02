'use client';

import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/registry/new-york/ui/button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { TeamInvitationService } from '@/app/utils/client/TeamInvitationService';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MembershipRole } from '@prisma/client';

const userInviteFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled' })
    .email('This is not a valid email'),
  role: z.nativeEnum(MembershipRole),
});

export function UserInviteForm({
  onInvite,
  onSuccess,
}: {
  onInvite: typeof TeamInvitationService.inviteUserToTeam;
  onSuccess: () => void;
}) {
  const [_error, setError] = useState<any>(null);
  const form = useForm<z.infer<typeof userInviteFormSchema>>({
    resolver: zodResolver(userInviteFormSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  async function onSubmit(values: z.infer<typeof userInviteFormSchema>) {
    setError(null);
    const { email, role } = values;

    try {
      const response = await onInvite(email, role);

      if (response.error) {
        setError(response.error);
        return;
      }

      onSuccess();
      form.reset();
    } catch (e) {
      console.log('Error submitting');
      console.error(e);
      setError(e);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="email" className="text-right">
                      Email
                    </FormLabel>
                    <Input
                      id="email"
                      placeholder="user@example.com"
                      className="col-span-3"
                      {...field}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div />
                    <FormMessage className="col-span-3" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="role" className="text-right">
                      Role
                    </FormLabel>

                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Role for the invited user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div />
                    <FormMessage className="col-span-3" />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Send an invite</Button>
          </DialogFooter>
        </form>
      </Form>
      {_error && <DialogFooter>Error: {_error}</DialogFooter>}
    </>
  );
}
