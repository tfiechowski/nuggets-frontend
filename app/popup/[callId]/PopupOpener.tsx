'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function openWindow(link: string): ReturnType<typeof window.open> {
  const { width, height } = window.screen;

  const newWindowWidth = width > 1280 ? 600 : 400;

  return window.open(
    link,
    'nuggets',
    `width=${newWindowWidth},height=${height},screenX=0,left=0,screenY=0,top=0,status=no,menubar=no`
  );
}

export function PopupOpener({ link }: { link: string }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const windowHandle = openWindow(link);

    if (windowHandle === null) {
      setError(JSON.stringify(windowHandle));
      return;
    }

    window.close();
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
