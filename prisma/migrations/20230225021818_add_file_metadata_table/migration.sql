/*
  Warnings:

  - Added the required column `file_metadata_id` to the `incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incident" ADD COLUMN     "file_metadata_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "file_metadata" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(200) NOT NULL,
    "path" VARCHAR(100) NOT NULL,
    "mimetype" VARCHAR(200) NOT NULL,

    CONSTRAINT "file_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "file_metadata_filename_idx" ON "file_metadata"("filename");

-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_file_metadata_id_fkey" FOREIGN KEY ("file_metadata_id") REFERENCES "file_metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
