/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,userId]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "memberships_organizationId_invitedEmail_key";

-- CreateIndex
CREATE UNIQUE INDEX "memberships_organizationId_userId_key" ON "memberships"("organizationId", "userId");
