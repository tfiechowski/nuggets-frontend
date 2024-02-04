import { DEFAULT_URL } from '@/app/utils/config';
import { sendEmail } from '@/app/utils/email/sendEmail';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getTeamMembers } from '@/app/utils/server/getTeamMembers';
import { getUserTeam } from '@/app/utils/server/getUserTeam';
import { FunctionalValidator, IFunctionalRuleValidator } from '@/lib/validator';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

interface RequestBody {
  email: string;
  role: string;
}

const RequestBody = z.object({
  email: z.string(),
  role: z.enum(['member', 'owner']),
});


const validateNotTeamMemberAlready: IFunctionalRuleValidator = (email: string) => async () => {
  const teamMembers = await getTeamMembers();

  return teamMembers.find((teamMember) => teamMember.email === email)
    ? { error: 'User is already a team member' }
    : {};
};

const validateCanInviteUsers: IFunctionalRuleValidator = () => async () => {
  const userTeam = await getUserTeam();

  return userTeam.role === 'owner' ? {} : { error: "You don't have permissions" };
};

async function handle(
  supabase: SupabaseClient,
  body: RequestBody
): Promise<{ data?: any; error?: any }> {
  const { email, role } = body;

  const functionalValidator = new FunctionalValidator([
    validateNotTeamMemberAlready(email),
    validateCanInviteUsers(),
  ]);

  // rework functional validator to throw exceptions?
  const validationError = await functionalValidator.validate();
  console.log('🚀 ~ validationError:', validationError);
  if (validationError.error) {
    return validationError;
  }

  const userTeam = await getUserTeam();
  console.log('🚀 ~ userTeam:', userTeam);

  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'test-1@breezeflow.eu',
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
      emailRedirectTo: `${DEFAULT_URL}/app`,
    },
  })

  // now get the user


  // create an membership entry in the database (account_users table - user_id/account_id/account_role)

  const { data, error } = await supabase.rpc('create_invitation', {
    account_id: userTeam.accountId,
    account_role: role,
    invitation_type: 'one_time',
  });

  if (error) {
    console.log('Cannot create invitation', error);
    return { error };
  }

  const { token: invitationToken } = data;

  console.log(`Created an invitation for ${email} to account (${userTeam.accountId})!`);

  const activationLink = `${DEFAULT_URL}/login?message=You%27ve+been+invited+to+join+a+team%21+Please+create+an+account&invitationToken${invitationToken}`
  const emailResponse = await sendEmail({
    subject: `You've been invited to ${userTeam.name}`,
    html: `
<div>
  <div>Hello, you've been invoted to ${userTeam.name}!</div>

  <div>
    Please go to 
    <a href="${activationLink}">this link to activate your account</a>
  <div>

  <div>
    If it doesn't work, copy and paste this link in your browser: ${activationLink}
  </div>

  <div>
    Best,
    Nuggets Team!
  </div>
</div>
    `,
    to: email,
  });
  console.log('🚀 ~ emailResponse:', emailResponse);

  return emailResponse.error ? { error: emailResponse.error } : {};
}

export async function POST(request: Request) {
  try {
    const body = RequestBody.parse(await request.json());

    const supabase = getServerSupabaseClient();

    const { data, error } = await handle(supabase, body);

    if (error) {
      return NextResponse.json({ error });
    }
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues });
    } else {
      return NextResponse.json({}, { status: 400 });
    }
  }
}
