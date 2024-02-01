'use client';

import { useAccounts } from '@usebasejump/next';

export default function TestComponent() {
  const { data, error, isLoading } = useAccounts();

  return isLoading ? <div>loading...</div> : <>{JSON.stringify(data)}</>;
}
