'use client';

import { Button } from '@/registry/new-york/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userInviteFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled' })
    .email('This is not a valid email'),
  role: z.enum(['member', 'owner']),
});

async function onInvite(email: string, role: 'member' | 'owner') {
  const response = await fetch('/api/teams/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });

  const body = await response.json();

  return body;
}

export function UserInviteDialog({}: {}) {
  const [_error, setError] = useState(null);
  console.log('🚀 ~ error:', _error);
  const form = useForm<z.infer<typeof userInviteFormSchema>>({
    resolver: zodResolver(userInviteFormSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  console.log('Form:', form);

  async function onSubmit(values: z.infer<typeof userInviteFormSchema>) {
    try {
      const response = await onInvite(values.email, values.role);
      console.log('🚀 ~ onSubmit ~ response:', response);

      if (response.error) {
        setError(response.error);
      }
    } catch (e) {
      console.log('Error submitting');
      console.error(e);
    }

    console.log('Values:', values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Invite</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
        {_error && <DialogFooter>Error: {JSON.stringify(_error)}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
