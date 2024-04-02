/*
  Warnings:

  - You are about to drop the column `amount` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `_ItemToRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ItemToRequest" DROP CONSTRAINT "_ItemToRequest_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToRequest" DROP CONSTRAINT "_ItemToRequest_B_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "amount";

-- DropTable
DROP TABLE "_ItemToRequest";

-- CreateTable
CREATE TABLE "RequestAmount" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestAmount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestAmount" ADD CONSTRAINT "RequestAmount_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAmount" ADD CONSTRAINT "RequestAmount_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
