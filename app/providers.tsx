'use client';

import { BasejumpUserSession } from '@usebasejump/next';

export function Providers({ children }: { children: React.ReactNode }) {
  return <BasejumpUserSession>{children}</BasejumpUserSession>;
}
