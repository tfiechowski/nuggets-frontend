/*
  Warnings:

  - You are about to drop the `CustomerCall` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerCall" DROP CONSTRAINT "CustomerCall_organizerId_fkey";

-- DropTable
DROP TABLE "CustomerCall";

-- CreateTable
CREATE TABLE "customer_calls" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "provider" "CustomerCallProvider" NOT NULL,
    "timezone" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "scheduled_end_at" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "customer_calls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customer_calls" ADD CONSTRAINT "customer_calls_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "memberships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
