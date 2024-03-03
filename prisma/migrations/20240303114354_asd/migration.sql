/*
  Warnings:

  - You are about to drop the column `idempotencyKey` on the `bot_calls` table. All the data in the column will be lost.
  - Added the required column `idempotency_key` to the `bot_calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bot_calls" DROP COLUMN "idempotencyKey",
ADD COLUMN     "idempotency_key" TEXT NOT NULL;
