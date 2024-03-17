/*
  Warnings:

  - Added the required column `content` to the `customer_call_note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer_call_note" ADD COLUMN     "content" TEXT NOT NULL;
