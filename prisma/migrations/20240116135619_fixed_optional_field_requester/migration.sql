-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_employeeId_fkey";

-- AlterTable
ALTER TABLE "Move" ALTER COLUMN "employeeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
