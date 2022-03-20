/*
  Warnings:

  - You are about to drop the column `beneficiaries` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `impactReport` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_beneficiaries_key";

-- DropIndex
DROP INDEX "users_impactReport_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "beneficiaries",
DROP COLUMN "impactReport",
ADD COLUMN     "cid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_cid_key" ON "users"("cid");
