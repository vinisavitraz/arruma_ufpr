/*
  Warnings:

  - You are about to drop the `incident_user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `incident` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "incident_user" DROP CONSTRAINT "incident_user_incident_id_fkey";

-- DropForeignKey
ALTER TABLE "incident_user" DROP CONSTRAINT "incident_user_user_id_fkey";

-- AlterTable
ALTER TABLE "incident" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "incident_user";

-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
