/*
  Warnings:

  - You are about to drop the column `object_id` on the `incident` table. All the data in the column will be lost.
  - You are about to drop the `object` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `item_id` to the `incident` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "incident" DROP CONSTRAINT "incident_object_id_fkey";

-- AlterTable
ALTER TABLE "incident" DROP COLUMN "object_id",
ADD COLUMN     "item_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "object";

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "item_name_idx" ON "item"("name");

-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
