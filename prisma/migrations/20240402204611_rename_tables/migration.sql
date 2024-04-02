/*
  Warnings:

  - You are about to drop the `Playbook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaybookTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Playbook";

-- DropTable
DROP TABLE "PlaybookTemplate";

-- CreateTable
CREATE TABLE "playbook_templates" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "playbook_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playbooks" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "customerCallId" TEXT NOT NULL,

    CONSTRAINT "playbooks_pkey" PRIMARY KEY ("id")
);
