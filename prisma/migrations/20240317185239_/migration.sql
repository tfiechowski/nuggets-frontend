/*
  Warnings:

  - You are about to drop the `Battlecard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Competitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Battlecard" DROP CONSTRAINT "Battlecard_competitorId_fkey";

-- DropForeignKey
ALTER TABLE "Competitor" DROP CONSTRAINT "Competitor_organizationId_fkey";

-- DropTable
DROP TABLE "Battlecard";

-- DropTable
DROP TABLE "Competitor";

-- CreateTable
CREATE TABLE "competitors" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battlecards" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,

    CONSTRAINT "battlecards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competitors_name_key" ON "competitors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "battlecards_competitorId_key" ON "battlecards"("competitorId");

-- AddForeignKey
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battlecards" ADD CONSTRAINT "battlecards_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "competitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
