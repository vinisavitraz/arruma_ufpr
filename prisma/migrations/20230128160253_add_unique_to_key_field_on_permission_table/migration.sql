/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "permission_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "permission_key_key" ON "permission"("key");
