/*
  Warnings:

  - Added the required column `title` to the `customer_calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer_calls" ADD COLUMN     "title" TEXT NOT NULL;
