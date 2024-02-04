import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';

async function signInWithEmail() {
  const supabase = getServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'test-1@breezeflow.eu',
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
      emailRedirectTo: 'https://example.com/welcome?invitationCode=123',
    },
  });

  console.log('🚀 ~ signInWithEmail ~ data, error:', data, error);
}

export default async function Test() {
  signInWithEmail();

  return <div>test</div>;
}
