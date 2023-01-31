/*
  Warnings:

  - Added the required column `location_id` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item" ADD COLUMN     "location_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
