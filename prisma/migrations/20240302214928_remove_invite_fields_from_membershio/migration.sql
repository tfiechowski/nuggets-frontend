/*
  Warnings:

  - You are about to drop the column `invitedEmail` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `invitedName` on the `memberships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "invitedEmail",
DROP COLUMN "invitedName";
