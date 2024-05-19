/*
  Warnings:

  - Added the required column `resourceId` to the `google_events_notification_channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "google_events_notification_channel" ADD COLUMN     "resourceId" TEXT NOT NULL;
