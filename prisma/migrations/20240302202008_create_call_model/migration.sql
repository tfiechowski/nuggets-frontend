-- CreateEnum
CREATE TYPE "CustomerCallProvider" AS ENUM ('ZOOM');

-- CreateTable
CREATE TABLE "CustomerCall" (
    "id" TEXT NOT NULL,
    "provider" "CustomerCallProvider" NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "CustomerCall_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerCall" ADD CONSTRAINT "CustomerCall_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "memberships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
