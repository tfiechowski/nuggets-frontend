'use client';

import { UserProvider } from '@/app/context/UserContext';
import { BasejumpUserSession } from '@usebasejump/next';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BasejumpUserSession>
      <UserProvider>{children}</UserProvider>
    </BasejumpUserSession>
  );
}
