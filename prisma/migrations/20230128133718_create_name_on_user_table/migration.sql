/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "name" VARCHAR(200) NOT NULL;

-- CreateTable
CREATE TABLE "user_token" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(80) NOT NULL,
    "token_number" VARCHAR(200) NOT NULL,
    "create_date" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" TIMESTAMP(0) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_token_token_number_idx" ON "user_token"("token_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
