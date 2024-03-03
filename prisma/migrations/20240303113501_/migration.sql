/*
  Warnings:

  - The values [NEW] on the enum `BotCallStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BotCallStatus_new" AS ENUM ('MARKED_FOR_SCHEDULE', 'SCHEDULED', 'RUNNING', 'FINISHED', 'FAILED');
ALTER TABLE "bot_calls" ALTER COLUMN "status" TYPE "BotCallStatus_new" USING ("status"::text::"BotCallStatus_new");
ALTER TYPE "BotCallStatus" RENAME TO "BotCallStatus_old";
ALTER TYPE "BotCallStatus_new" RENAME TO "BotCallStatus";
DROP TYPE "BotCallStatus_old";
COMMIT;
