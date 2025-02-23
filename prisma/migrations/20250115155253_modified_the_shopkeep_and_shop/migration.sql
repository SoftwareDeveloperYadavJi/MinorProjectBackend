/*
  Warnings:

  - You are about to drop the column `shopId` on the `ShopKeeper` table. All the data in the column will be lost.
  - Added the required column `shopKeeperId` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShopKeeper" DROP CONSTRAINT "ShopKeeper_shopId_fkey";

-- DropIndex
DROP INDEX "ShopKeeper_shopId_key";

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "shopKeeperId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShopKeeper" DROP COLUMN "shopId";

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_shopKeeperId_fkey" FOREIGN KEY ("shopKeeperId") REFERENCES "ShopKeeper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
