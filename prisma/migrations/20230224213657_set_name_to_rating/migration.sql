/*
  Warnings:

  - You are about to drop the column `review` on the `incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "incident" DROP COLUMN "review",
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;
