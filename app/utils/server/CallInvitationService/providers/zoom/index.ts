export interface ZoomCall {
  id: string;
  password: string;
  url: string;
  customerDomain: string;
}

export function parseZoomUrl(zoomUrl: string): {
  zoomCallId: string;
  zoomCallPassword: string;
  zoomCustomerDomain: string;
} {
  let zoomCallPassword = '';
  let zoomCallId = '';
  let zoomCustomerDomain = '';

  const regex = /https:\/\/(.*)\.zoom\.us\/j\/([0-9]+)\?pwd=([a-zA-Z0-9\.]{1,32})/gm;
  let m;

  while ((m = regex.exec(zoomUrl)) !== null) {
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
        zoomCallPassword = match;
      }
    });
  }

  return {
    zoomCallId,
    zoomCallPassword,
    zoomCustomerDomain,
  };
}
