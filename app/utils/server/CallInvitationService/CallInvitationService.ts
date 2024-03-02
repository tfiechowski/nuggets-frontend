import {prisma} from "@/lib/db"
import { parseInvitation } from "@/app/utils/server/CallInvitationService/parseInvitation";
import { CustomerCallProvider } from "@prisma/client";

export class CallInvitationService {
  public static async processNewInvitation(attachment: string) {
    const invite = await fetch(attachment);
    const inviteContent = await invite.text();

    // TODO: check if organizer is inviter as well
    const invitationData = parseInvitation(inviteContent);

    await prisma.customerCall.create({
      data: {
        provider: CustomerCallProvider.ZOOM,
        
      }
    })



  }
}