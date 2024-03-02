import { prisma } from '@/lib/db';
import { parseInvitation } from '@/app/utils/server/CallInvitationService/parseInvitation';
import { CustomerCallProvider } from '@prisma/client';

export class CallInvitationService {
  public static async processNewInvitation(attachment: string) {
    const invite = await fetch(attachment);
    const inviteContent = await invite.text();

    const invitationData = parseInvitation(inviteContent);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: invitationData.organizer,
      },
      include: {
        memberships: true,
      },
    });

    const membershipId = user.memberships[0].id;

    const customerCall = await prisma.customerCall.findFirst({
      where: {
        eventId: invitationData.uid,
      },
    });

    if (customerCall === null) {
      // Create new customer call
      await prisma.customerCall.create({
        data: {
          eventId: invitationData.uid,
          organizerId: membershipId,
          provider: CustomerCallProvider.ZOOM,
          scheduledAt: invitationData.start,
          scheduledEndAt: invitationData.end,
          timezone: invitationData.timezone,
          data: {
            zoom: { ...invitationData.zoomCall },
          },
        },
      });
    } else {
      // Update existing
      await prisma.customerCall.update({
        where: {
          id: customerCall.id,
          eventId: customerCall.eventId,
        },
        data: {
          organizerId: membershipId,
          provider: CustomerCallProvider.ZOOM,
          scheduledAt: invitationData.start,
          scheduledEndAt: invitationData.end,
          timezone: invitationData.timezone,
          data: {
            zoom: { ...invitationData.zoomCall },
          },
        },
      });
    }
  }
}
