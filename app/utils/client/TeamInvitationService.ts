import { MembershipRole } from '@prisma/client';

export class TeamInvitationService {
  static async inviteUserToTeam(
    email: string,
    role: MembershipRole
  ): Promise<{ error?: any; data?: any }> {
    const response = await fetch('/api/teams/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });

    const body = await response.json();

    return body;
  }
}
