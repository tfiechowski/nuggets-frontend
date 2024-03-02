/*
  Warnings:

  - Added the required column `scheduled_end_at` to the `CustomerCall` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `CustomerCall` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomerCall" ADD COLUMN     "scheduled_end_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL;
