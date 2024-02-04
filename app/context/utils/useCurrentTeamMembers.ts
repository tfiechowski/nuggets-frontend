import { UserContext } from '@/app/context/UserContext';
import { useContext } from 'react';

export function useCurrentTeamMembers() {
  const { account } = useContext(UserContext);
}
