-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RetroBoard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RetroSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RetroSection_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "RetroBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RetroItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RetroItem_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "RetroBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RetroItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "RetroSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RetroBoard_createdBy_idx" ON "RetroBoard"("createdBy");

-- CreateIndex
CREATE INDEX "RetroSection_boardId_order_idx" ON "RetroSection"("boardId", "order");

-- CreateIndex
CREATE INDEX "RetroItem_boardId_idx" ON "RetroItem"("boardId");

-- CreateIndex
CREATE INDEX "RetroItem_sectionId_idx" ON "RetroItem"("sectionId");
