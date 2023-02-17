/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "address" VARCHAR(500) NOT NULL,
ADD COLUMN     "document" VARCHAR(15) NOT NULL,
ADD COLUMN     "phone" VARCHAR(15) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_document_key" ON "user"("document");
