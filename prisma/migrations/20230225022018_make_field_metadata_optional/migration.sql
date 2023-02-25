-- DropForeignKey
ALTER TABLE "incident" DROP CONSTRAINT "incident_file_metadata_id_fkey";

-- AlterTable
ALTER TABLE "incident" ALTER COLUMN "file_metadata_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_file_metadata_id_fkey" FOREIGN KEY ("file_metadata_id") REFERENCES "file_metadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;
