import { createClient } from '@supabase/supabase-js'
import {parseInvitation} from './process-payload';

export class ZoomInvitationService {
  public async handleEmailInvitation(payload: {attachment: string}) {
    const { attachment } = payload;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )

    const invite = await fetch(attachment);
  
    const ret = parseInvitation(await invite.text());

    // Add validation here on account_id

    supabase.from('call_invites').insert({
      owner: ret.organizer,
    })
  
    console.log('Ret:', ret);
  
    return ret;
  }
}