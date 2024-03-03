-- CreateEnum
CREATE TYPE "BotCallStatus" AS ENUM ('MARKED_FOR_SCHEDULE', 'SCHEDULED', 'RUNNING');

-- CreateTable
CREATE TABLE "bot_calls" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "callId" TEXT NOT NULL,
    "status" "BotCallStatus" NOT NULL,

    CONSTRAINT "bot_calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bot_calls_callId_key" ON "bot_calls"("callId");
