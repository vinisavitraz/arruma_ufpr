/*
  Warnings:

  - The primary key for the `role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `role_permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id", "permission_id");
