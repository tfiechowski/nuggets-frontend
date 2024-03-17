-- CreateTable
CREATE TABLE "customer_call_note" (
    "id" TEXT NOT NULL,
    "customerCallId" TEXT NOT NULL,

    CONSTRAINT "customer_call_note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_call_note_customerCallId_key" ON "customer_call_note"("customerCallId");

-- AddForeignKey
ALTER TABLE "customer_call_note" ADD CONSTRAINT "customer_call_note_customerCallId_fkey" FOREIGN KEY ("customerCallId") REFERENCES "customer_calls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
