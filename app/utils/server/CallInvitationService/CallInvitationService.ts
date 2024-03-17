import { prisma } from '@/lib/db';
import { parseInvitation } from '@/app/utils/server/CallInvitationService/parseInvitation';
import { CustomerCallProvider } from '@prisma/client';
import { CallNoteService } from '@/app/utils/server/CallNoteService';

export class CallInvitationService {
  public static async processEmailInvitation(attachment: string) {
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

    const existingCustomerCall = await prisma.customerCall.findFirst({
      where: {
        eventId: invitationData.uid,
      },
    });

    if (existingCustomerCall === null) {
      // Create new customer call

      // await prisma.$transaction(async tx => {
      const newCustomerCall = await prisma.customerCall.create({
        data: {
          data: { zoom: { ...invitationData.zoomCall } },
          eventId: invitationData.uid,
          organizerId: membershipId,
          provider: CustomerCallProvider.ZOOM,
          scheduledAt: invitationData.start,
          scheduledEndAt: invitationData.end,
          timezone: invitationData.timezone,
          title: invitationData.title,
        },
      });
      console.log(
        '🚀 ~ CallInvitationService ~ processEmailInvitation ~ newCustomerCall:',
        newCustomerCall
      );

      await CallNoteService.create(newCustomerCall.id);
      // });
    } else {
      // Update existing
      await prisma.customerCall.update({
        where: {
          id: existingCustomerCall.id,
          eventId: existingCustomerCall.eventId,
        },
        data: {
          organizerId: membershipId,
          provider: CustomerCallProvider.ZOOM,
          scheduledAt: invitationData.start,
          scheduledEndAt: invitationData.end,
          timezone: invitationData.timezone,
          title: invitationData.title,
          data: {
            zoom: { ...invitationData.zoomCall },
          },
        },
      });
    }
  }
}
