/*
  Warnings:

  - Added the required column `status` to the `incident_interaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `incident_type` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incident_interaction" ADD COLUMN     "status" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "incident_type" ADD COLUMN     "status" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "status" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "location" ADD COLUMN     "status" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" VARCHAR(50) NOT NULL;
