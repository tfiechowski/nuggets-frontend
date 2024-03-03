/*
  Warnings:

  - A unique constraint covering the columns `[event_id]` on the table `customer_calls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `bot_calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizer` to the `bot_calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `bot_calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_at` to the `bot_calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_end_at` to the `bot_calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `bot_calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BotCallStatus" ADD VALUE 'NEW';
ALTER TYPE "BotCallStatus" ADD VALUE 'FINISHED';
ALTER TYPE "BotCallStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "bot_calls" ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "organizer" TEXT NOT NULL,
ADD COLUMN     "provider" "CustomerCallProvider" NOT NULL,
ADD COLUMN     "scheduled_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "scheduled_end_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customer_calls_event_id_key" ON "customer_calls"("event_id");
