/*
  Warnings:

  - Added the required column `origin` to the `incident_interaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incident_interaction" ADD COLUMN     "origin" INTEGER NOT NULL;
