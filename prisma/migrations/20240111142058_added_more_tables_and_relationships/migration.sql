/*
  Warnings:

  - You are about to drop the column `amount` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[register]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[supplyId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `register` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplyId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volumeId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Item_brandId_key";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "register" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "amount",
DROP COLUMN "reference",
DROP COLUMN "volume",
ADD COLUMN     "batch" TEXT,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "expiration" TIMESTAMP(3),
ADD COLUMN     "serial" TEXT,
ADD COLUMN     "supplyId" INTEGER NOT NULL,
ADD COLUMN     "volumeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volume" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Volume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supply" (
    "id" SERIAL NOT NULL,
    "current" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "type" CHAR(1) NOT NULL,
    "amount" INTEGER NOT NULL,
    "supplyId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_register_key" ON "Employee"("register");

-- CreateIndex
CREATE UNIQUE INDEX "Item_supplyId_key" ON "Item"("supplyId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "Volume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_supplyId_fkey" FOREIGN KEY ("supplyId") REFERENCES "Supply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_supplyId_fkey" FOREIGN KEY ("supplyId") REFERENCES "Supply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
