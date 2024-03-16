import { UnauthorizedError } from '@/app/utils/server/errors';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getUserId(): Promise<string> {
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();

  const userId = user.data.user?.id;

  if (userId === undefined) {
    throw new UnauthorizedError('Invalid user session');
  }

  return userId;
}
