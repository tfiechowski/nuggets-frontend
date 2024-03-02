// This could be actually done on Vercel side with the ical library for handling
// the ical files in a proper manner, instead of these regexps :D

interface Data {
  attachment: string;
}

interface InvitationData {
  zoomCallId: string;
  zoomCallPassword: string;
  organizer: string;
  zoomCustomerDomain: string;
}

export function parseInvitation(content: string): InvitationData {
  const lines = content.split('\n');

  console.log('Content:', lines);

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
      console.log('Found organizer!');

      const regex = /mailto:(.*)/gm;
      let m;
      while ((m = regex.exec(line)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          console.log(`Found match, group ${groupIndex}: ${match}`);
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
          console.log(`Found match, group ${groupIndex}: ${match}`);

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
    }
  }

  return {
    zoomCallPassword,
    organizer,
    zoomCallId,
    zoomCustomerDomain,
  };
}

export async function processInvitation(data: Data): Promise<InvitationData> {
  const { attachment } = data;

  const invite = await fetch(attachment);

  const ret = parseInvitation(await invite.text());

  console.log('Ret:', ret);

  return ret;
}
