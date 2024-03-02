import { prisma } from '@/lib/db';

export default async function App() {
  const users = await prisma.user.findMany();

  return (
    <div>
      elo! users:
      {JSON.stringify(users)}
    </div>
  );
}
