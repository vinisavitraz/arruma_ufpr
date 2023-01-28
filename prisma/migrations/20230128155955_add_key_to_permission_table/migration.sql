/*
  Warnings:

  - Added the required column `key` to the `permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "permission" ADD COLUMN     "key" VARCHAR(30) NOT NULL;
