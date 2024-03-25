import { useCallback } from 'react';

function openWindow(link: string): ReturnType<typeof window.open> {
  const { width, height } = window.screen;

  const newWindowWidth = width > 1280 ? 600 : 400;

  return window.open(
    link,
    'nuggets',
    `width=${newWindowWidth},height=${height},screenX=0,left=0,screenY=0,top=0,status=no,menubar=no`
  );
}

export function useOpenWindow(): (link: string, closeCurrent: boolean) => { error: string | null } {
  const handle = useCallback((link: string, closeCurrent: boolean) => {
    const windowHandle = openWindow(link);

    if (windowHandle === null) {
      return { error: 'Error' };
    }

    if (closeCurrent) {
      console.log('🚀 ~ handle ~ closeCurrent:', closeCurrent);
      window.close();
    }

    return { error: null };
  }, []);

  return handle;
}
