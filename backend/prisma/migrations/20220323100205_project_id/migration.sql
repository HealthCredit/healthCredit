/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "projectId" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "users_projectId_key" ON "users"("projectId");
