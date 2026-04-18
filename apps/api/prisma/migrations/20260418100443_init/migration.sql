-- CreateEnum
CREATE TYPE "RetroSectionType" AS ENUM ('DEFAULT', 'CUSTOM');

-- CreateTable
CREATE TABLE "retro_boards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retro_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retro_sections" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "RetroSectionType" NOT NULL DEFAULT 'CUSTOM',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retro_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retro_items" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retro_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "retro_sections_boardId_order_idx" ON "retro_sections"("boardId", "order");

-- CreateIndex
CREATE INDEX "retro_items_boardId_createdAt_idx" ON "retro_items"("boardId", "createdAt");

-- CreateIndex
CREATE INDEX "retro_items_sectionId_createdAt_idx" ON "retro_items"("sectionId", "createdAt");

-- AddForeignKey
ALTER TABLE "retro_sections" ADD CONSTRAINT "retro_sections_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "retro_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retro_items" ADD CONSTRAINT "retro_items_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "retro_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retro_items" ADD CONSTRAINT "retro_items_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "retro_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
