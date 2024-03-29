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

const userInviteFormSchema = z.object({
  name: z.string().min(1, { message: 'This field has to be filled' }),
});

export function CreateNewCompetitorNoteForm({
  onInvite,
  onSuccess,
}: {
  onInvite: (competitorName: string) => {};
  onSuccess: () => void;
}) {
  const [_error, setError] = useState<any>(null);
  const form = useForm<z.infer<typeof userInviteFormSchema>>({
    resolver: zodResolver(userInviteFormSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof userInviteFormSchema>) {
    setError(null);
    const { name } = values;

    try {
      await onInvite(name);
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
            <DialogTitle>Create a new competitor note</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      Competitor Name
                    </FormLabel>
                    <Input
                      id="name"
                      placeholder="competitor name"
                      className="col-span-2"
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
          </div>
          <DialogFooter>
            <Button type="submit">Create new</Button>
          </DialogFooter>
        </form>
      </Form>
      {_error && <DialogFooter>Error: {_error}</DialogFooter>}
    </>
  );
}
