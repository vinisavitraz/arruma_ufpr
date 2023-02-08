-- AlterTable
ALTER TABLE "incident" ADD COLUMN     "admin_id" INTEGER;

-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
