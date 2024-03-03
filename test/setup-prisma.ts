jest.mock('@/lib/db', () => {
  return {
    prisma: jestPrisma.client,
  };
});
