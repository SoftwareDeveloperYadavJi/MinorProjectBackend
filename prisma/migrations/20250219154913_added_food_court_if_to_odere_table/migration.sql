/*
  Warnings:

  - Added the required column `foodCourtId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "foodCourtId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_foodCourtId_fkey" FOREIGN KEY ("foodCourtId") REFERENCES "FoodCourt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
