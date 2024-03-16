import { OrganizationService } from '@/app/utils/server/OrganizationService';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getUserId } from '@/app/utils/server/getUserId';
import { getUserMembership } from '@/app/utils/server/getUserTeam';
import { MembershipRole } from '@prisma/client';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  name: string | null;
  email: string;
  role: MembershipRole;
};

export async function getTeamMembers(): Promise<User[]> {
  const userMembership = await getUserMembership();
  console.log('🚀 ~ getTeamMembers ~ userTeam:', userMembership);
  const userTeamMembers = await OrganizationService.getOrganizationMembers(
    userMembership.organization.id
  );
  console.log('🚀 ~ getTeamMembers ~ userTeamMembers:', userTeamMembers);

  return userTeamMembers.map((member) => ({
    name: member.name,
    email: member.email,
    role: member.role,
  }));
}
