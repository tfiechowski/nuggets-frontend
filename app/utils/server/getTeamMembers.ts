import { OrganizationService } from '@/app/utils/server/OrganizationService';
import { getServerSupabaseClient } from '@/app/utils/server/getServerSupabaseClient';
import { getUserId } from '@/app/utils/server/getUserId';
import { getUserOrganization } from '@/app/utils/server/getUserTeam';
import { MembershipRole } from '@prisma/client';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  name: string | null;
  email: string;
  role: MembershipRole;
};

export async function getTeamMembers(): Promise<User[]> {
  const userTeam = await getUserOrganization();
  console.log('🚀 ~ getTeamMembers ~ userTeam:', userTeam);
  const userTeamMembers = await OrganizationService.getOrganizationMembers(userTeam.organizationId);
  console.log('🚀 ~ getTeamMembers ~ userTeamMembers:', userTeamMembers);

  return userTeamMembers.map((member) => ({
    name: member.name,
    email: member.email,
    role: member.memberships[0].role,
  }));
}
