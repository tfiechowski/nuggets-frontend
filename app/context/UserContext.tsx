'use client';

import { createContext, useMemo } from 'react';
import { useAccounts } from '@usebasejump/next';

interface Account {
  accountId: string;
  accountRole: 'member' | 'owner';
  name: string;
  slug: string;
}

interface UserContext {
  account: Account;
  hasTeam: false;
}

function getDefaultValue() {
  return { account: {}, hasTeam: false };
}

export const UserContext = createContext<UserContext>(null as any);

export function UserProvider({ children }: { children: React.ReactNode }) {
  console.log('HERE');
  const { data, error, isLoading } = useAccounts();
  // Caching is possible to be added here, on a first login actually or creation of a team
  // Then cleaned up on logout

  const value = useMemo<UserContext>(() => {
    if (isLoading || error) {
      return null as any;
    }

    if (data === undefined) {
      return null as any;
    }

    const teamAccount = data.find((account) => account.personal_account === false);

    if (teamAccount === undefined) {
      return { account: {}, hasTeam: false };
    }

    return {
      account: {
        accountId: teamAccount?.account_id,
        accountRole: teamAccount?.role,
        name: teamAccount?.name,
        slug: teamAccount?.slug,
      },
      hasTeam: true,
    };
  }, [isLoading, error, data]);

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
