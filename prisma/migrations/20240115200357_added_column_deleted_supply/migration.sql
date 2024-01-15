-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_supplyId_fkey";

-- AlterTable
ALTER TABLE "Supply" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_supplyId_fkey" FOREIGN KEY ("supplyId") REFERENCES "Supply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
