import { NEXT_PUBLIC_DEFAULT_URL } from '@/app/utils/config';
import { sendEmail } from '@/app/utils/email/sendEmail';
import { OrganizationService } from '@/app/utils/server/OrganizationService';
import { UserService } from '@/app/utils/server/UserService';
import { getTeamMembers } from '@/app/utils/server/getTeamMembers';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { FunctionalValidator, IFunctionalRuleValidator } from '@/lib/validator';
import { MembershipRole } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

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
  const userMembership = await getUserMembership();

  return userMembership.role === MembershipRole.OWNER
    ? {}
    : { error: "You don't have permissions" };
};

async function handle(body: RequestBody): Promise<{ data?: any; error?: any }> {
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

  const userMembership = await getUserMembership();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as any,
    process.env.SUPABASE_SERVICE_ROLE_KEY as any
  );

  if (await UserService.exists(email)) {
    return { error: 'Multiple orgs are not supported yet' };
  } else {
    const createdUser = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
    const userId = createdUser.data.user?.id as string;

    const invitation = await OrganizationService.inviteUser(
      userMembership.organization.id,
      userId,
      role
    );

    const { id: invitationToken } = invitation;

    const emailResponse = await sendEmail({
      to: email,
      subject: `Nuggets - You've been invited to join ${userMembership.team.name}`,
      html: `<a href="${NEXT_PUBLIC_DEFAULT_URL}/auth/accept-invitation?invitationToken=${invitationToken}&company=${userMembership.team.name}&email=${email}">Join!</a>`,
    });

    if (emailResponse.error) {
      console.error('Cannot send an email', emailResponse.error);
      return { error: emailResponse.error };
    }

    console.log(
      `Created an invitation for ${email} to account (${userMembership.organization.id})!`
    );
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const body = RequestBody.parse(await request.json());

    const { data, error } = await handle(body);

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
