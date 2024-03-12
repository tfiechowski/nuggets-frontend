import { DEFAULT_URL } from '@/app/utils/config';
import { sendEmail } from '@/app/utils/email/sendEmail';
import { OrganizationService } from '@/app/utils/server/OrganizationService';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getTeamMembers } from '@/app/utils/server/getTeamMembers';
import { getUserOrganization } from '@/app/utils/server/getUserTeam';
import { FunctionalValidator, IFunctionalRuleValidator } from '@/lib/validator';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { MembershipRole } from '@prisma/client';
import { UserService } from '@/app/utils/server/UserService';

interface RequestBody {
  email: string;
  role: MembershipRole;
}

const RequestBody = z.object({
  email: z.string(),
  role: z.nativeEnum(MembershipRole),
});

const validateNotTeamMemberAlready: IFunctionalRuleValidator = (email: string) => async () => {
  const teamMembers = await getTeamMembers();

  return teamMembers.find((teamMember) => teamMember.email === email)
    ? { error: 'User is already a team member' }
    : {};
};

const validateCanInviteUsers: IFunctionalRuleValidator = () => async () => {
  const userTeam = await getUserOrganization();

  return userTeam.role === MembershipRole.OWNER ? {} : { error: "You don't have permissions" };
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

  if (validationError.error) {
    return validationError;
  }

  const userTeam = await getUserOrganization();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as any,
    process.env.SUPABASE_SERVICE_ROLE_KEY as any
  );

  if (await UserService.exists(email)) {
    return { error: 'Multiple orgs are not supported yet' };
  } else {
    const createdUser = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
    const userId = createdUser.data.user?.id as string;

    const invitation = await OrganizationService.inviteUser(userTeam.organizationId, userId, role);

    const { id: invitationToken } = invitation;

    const emailResponse = await sendEmail({
      to: email,
      subject: `Nuggets - You've been invited to join ${userTeam.name}`,
      html: `<a href="${DEFAULT_URL}/auth/accept-invitation?invitationToken=${invitationToken}&company=${userTeam.name}&email=${email}">Join!</a>`,
    });

    if (emailResponse.error) {
      console.error('Cannot send an email', emailResponse.error);
      return { error: emailResponse.error };
    }

    console.log(`Created an invitation for ${email} to account (${userTeam.organizationId})!`);
    return {};
  }
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
    console.log('🚀 ~ POST ~ error:', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues });
    } else {
      console.log('Non Zod error', error);
      return NextResponse.json({ error }, { status: 400 });
    }
  }
}
