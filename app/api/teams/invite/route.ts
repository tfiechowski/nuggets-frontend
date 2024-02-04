import { DEFAULT_URL } from '@/app/utils/config';
import { sendEmail } from '@/app/utils/email/sendEmail';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getTeamMembers } from '@/app/utils/server/getTeamMembers';
import { getUserTeam } from '@/app/utils/server/getUserTeam';
import { FunctionalValidator, IFunctionalRuleValidator } from '@/lib/validator';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
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

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as any,
    process.env.SUPABASE_SERVICE_ROLE_KEY as any
  );

  const createUserRes = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });

  const {data, error} = await supabase.rpc('create_invitation', {
    account_id: userTeam.accountId,
    account_role: role,
    invitation_type: 'one_time',
  });
  console.log("🚀 create_invitation ~ data, error:", data, error)


  const { token: invitationToken } = data;
  // const res = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {redirectTo: `${DEFAULT_URL}/login?elo=mordo`})

  // const res = await supabaseAdmin.auth.admin.generateLink({
  //   type: 'magiclink',
  //   email,
  //   options: {
  //     redirectTo: `http://127.0.0.1:3000/auth/invitation/accept?kurwa=elo`,
  //   }
  // })

  sendEmail({
    to: email,
    subject: `dawaj kurwa do ${userTeam.name}`,
    html: `<a href="http://127.0.0.1:3000/login-otp?invitationToken=${invitationToken}&message=dawaj+do+${userTeam.name}}">dawaj kurwa</a>`
  });

  // console.log("🚀 generateLink ~ res:", res)

  // console.log("🚀 inviteUserByEmail ~ res:", res);

  // create an membership entry in the database (account_users table - user_id/account_id/account_role)
  // const res = await supabase.from('account_users').insert({
  //   user_id: user.data.user?.id,
  //   account_id: userTeam.accountId,
  //   account_role: role,
  // });
  // console.log("🚀 ~ account_users ~ res:", res)

  if (error) {
    console.log('Cannot create invitation', error);
    return { error };
  }

  return {};
  // console.log(`Created an invitation for ${email} to account (${userTeam.accountId})!`);
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
