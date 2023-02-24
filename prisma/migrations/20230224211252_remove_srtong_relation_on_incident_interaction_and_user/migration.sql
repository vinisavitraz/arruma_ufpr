-- DropForeignKey
ALTER TABLE "incident_interaction" DROP CONSTRAINT "incident_interaction_user_id_fkey";

-- AlterTable
ALTER TABLE "incident_interaction" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "incident_interaction" ADD CONSTRAINT "incident_interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
