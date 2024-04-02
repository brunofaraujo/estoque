/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Volume` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Volume" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Volume_name_key" ON "Volume"("name");
