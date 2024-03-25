'use client';

import { useOpenWindow } from '@/app/popup/useOpenWindow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function PopupOpener({ link }: { link: string }) {
  const [error, setError] = useState<string | null>(null);

  const openWindow = useOpenWindow();

  useEffect(() => {
    const { error } = openWindow(link, true);

    if (error) {
      setError(error);
    }
  }, []);

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div>
          <Alert>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Cannot open the Nuggets assistant!</AlertTitle>
            <AlertDescription className="pt-4 pb-2">
              <div>Try allowing the site to show pop-ups and try again!</div>
              <div className="font-thin mt-6">
                Or you can go to{' '}
                <Link href={link} className="text-brand-pink hover:underline">
                  Nuggets assistant
                </Link>{' '}
                directly
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <div></div>;
}
