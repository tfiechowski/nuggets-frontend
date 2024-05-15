/*
  Warnings:

  - You are about to drop the `UserGoogleOAuthRefreshTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserGoogleOAuthRefreshTokens";

-- CreateTable
CREATE TABLE "google_calendar_integrations" (
    "membershipId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "nextSyncToken" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "google_calendar_integrations_membershipId_key" ON "google_calendar_integrations"("membershipId");
