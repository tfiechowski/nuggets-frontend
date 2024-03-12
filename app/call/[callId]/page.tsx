import { prisma } from '@/lib/db';

export default async function Page({ params }: { params: { callId: string } }) {
  const call = await prisma.customerCall.findUnique({
    where: {
      id: params.callId,
    },
  });

  if (call === null) {
    return <div>Not found! TODO: Add some sales pitch, swag here!</div>;
  }

  return <div>CallId: {JSON.stringify(call)}</div>;
}
