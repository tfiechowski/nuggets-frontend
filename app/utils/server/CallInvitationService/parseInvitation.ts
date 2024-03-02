// This could be actually done on Vercel side with the ical library for handling
// the ical files in a proper manner, instead of these regexps :D

import * as ICAL from 'node-ical';

interface Data {
  attachment: string;
}

interface InvitationData {
  zoomCallId: string;
  zoomCallPassword: string;
  organizer: string;
  zoomCustomerDomain: string;
  timezone: string;
  uid: string
}

export function parseInvitation(content: string): InvitationData {
  const x = ICAL.parseICS(content);
  console.log("\n\n\tData:", JSON.stringify(x, null, 2));


  const lines = content.split('\n');

  let uid = '';
  let timezone = '';
  let start = '';
  let end = '';
  let organizer = '';
  let zoomCallPassword = '';
  let zoomCallId = '';
  let zoomCustomerDomain = '';

  const linesIterator = lines[Symbol.iterator]();

  while (true) {
    const line = linesIterator.next().value;

    if (!line) {
      break;
    }

    if (line.includes('ORGANIZER:') || line.includes('ORGANIZER;')) {
      
      const regex = /mailto:(.*)/gm;
      let m;
      while ((m = regex.exec(line)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          organizer = match;
        });
      }
    } else if (line.includes('LOCATION:')) {
      const regex = /https:\/\/(.*)\.zoom\.us\/j\/([0-9]+)\?pwd=([a-zA-Z0-9\.]{1,32})/gm;
      let m;
      
      while ((m = regex.exec(line)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          
          if (groupIndex === 1) {
            zoomCustomerDomain = match;
          } else if (groupIndex === 2) {
            zoomCallId = match;
          } else if (groupIndex === 3) {
            let extra = linesIterator.next().value.trim();
            
            zoomCallPassword = match + extra;
          }
        });
      }
    } else if (line.includes('TZNAME:') || line.includes('TZNAME;')) {
      timezone = line.split(':')[1];
    } else if (line.includes('DTSTART:') || line.includes('DTSTART;')) {
      
    } else if (line.includes('DTEND:') || line.includes('DTEND;')) {
      
    } else if (line.includes('UID:') || line.includes('UID;')) {
      if(line.includes('UID:')) {
        uid = line.split(':')[1];
        
      } else if(line.includes('UID;')){
        uid = line.split(';')[1];
      }
    }
  }
  
  return {
    zoomCallPassword,
    organizer,
    zoomCallId,
    zoomCustomerDomain,
    timezone,
    uid
  };
}

export async function processInvitation(data: Data): Promise<InvitationData> {
  const { attachment } = data;
  
  const invite = await fetch(attachment);
  
  const ret = parseInvitation(await invite.text());
  
  
  return ret;
}
