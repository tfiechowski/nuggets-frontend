'use client';

import { NODE_ENV } from '@/app/utils/config';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export default function GACLientSide({ userId }: { userId: string }) {
  useEffect(() => {
    if (NODE_ENV === 'production') {
      console.log(`Initialising ReactGA for user ${userId}`);

      ReactGA.initialize([
        {
          trackingId: 'G-4CNMYESB9K',
          gaOptions: { userId },
        },
      ]);

      console.log(`After Initialising ReactGA for user ${userId}`);
    }
  }, []);

  return <></>;
}
