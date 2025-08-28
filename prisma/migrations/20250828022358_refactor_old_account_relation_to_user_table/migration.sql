/*
  Warnings:

  - You are about to drop the column `birthDat` on the `OldAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[oldAccountId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthDate` to the `OldAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OldAccount" DROP COLUMN "birthDat",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_oldAccountId_key" ON "users"("oldAccountId");
