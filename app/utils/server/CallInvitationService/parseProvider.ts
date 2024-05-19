import { ZoomCall, parseZoomUrl } from '@/app/utils/server/CallInvitationService/providers/zoom';

export type CallProvider = 'ZOOM';

const locationToParser: Array<{
  provider: CallProvider;
  matchesLocation: (location: string) => boolean;
  parseLocation: (location: string) => { provider: CallProvider; data: any };
}> = [
  {
    provider: 'ZOOM',
    matchesLocation: (location: string) => {
      return location.includes('zoom.us');
    },
    parseLocation: (location: string): { provider: 'ZOOM'; data: ZoomCall } => {
      const zoomCallData = parseZoomUrl(location);
      const zoomCall: ZoomCall = {
        customerDomain: zoomCallData.zoomCustomerDomain,
        id: zoomCallData.zoomCallId,
        password: zoomCallData.zoomCallPassword,
        url: location,
      };

      return { provider: 'ZOOM', data: zoomCall };
    },
  },
];

export function parseLocation(location: string): { provider: CallProvider; data: any } | null {
  const parser = locationToParser.find((parser) => parser.matchesLocation(location));

  if (!parser) {
    return null;
  }

  return parser.parseLocation(location);
}
