import { NODE_ENV } from '@/app/utils/config';
import ReactGA from 'react-ga4';

const devTrackerHandler =
  (name: string) =>
  (...args: any[]) => {
    // eslint-disable-next-line
    console.log(`%canalytics.${name}(): ${JSON.stringify(args)}`, 'color: green;');
  };

export default NODE_ENV === 'production' || window.location.hostname === 'getnuggets.io'
  ? {
      pageview: (path: any) => ReactGA.send({ hitType: 'pageview', page: path }),
      track: ReactGA.event,
      // timing: (category, variable, value, label) =>
      //   ReactGA.timing({ category, variable, value, label }),
    }
  : {
      pageview: devTrackerHandler('pageview'),
      track: devTrackerHandler('event'),
      // timing: devTrackerHandler('timing'),
    };
