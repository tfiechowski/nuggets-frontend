import { getUserId } from '@/app/utils/server/getUserId';
import GACLientSide from '@/components/analytics/GAClientSide';

export default async function GoogleAnalytics() {
  const userId = await getUserId();

  return <GACLientSide userId={userId} />;
}
