/*
  Warnings:

  - Added the required column `idempotencyKey` to the `bot_calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bot_calls" ADD COLUMN     "idempotencyKey" TEXT NOT NULL;
