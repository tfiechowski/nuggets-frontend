-- CreateTable
CREATE TABLE "google_events_notification_channel" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "google_events_notification_channel_pkey" PRIMARY KEY ("id")
);
