import { NODE_ENV } from '@/app/utils/config';
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

export default function GoogleAnalytics() {
  if (NODE_ENV !== 'production') {
    return <></>;
  }

  return (
    <span id="nuggets-google-analytics">
      <NextGoogleAnalytics gaId="G-4CNMYESB9K" />
    </span>
  );
}
