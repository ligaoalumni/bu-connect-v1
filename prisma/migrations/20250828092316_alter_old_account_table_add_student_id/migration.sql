/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `OldAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `OldAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OldAccount" ADD COLUMN     "studentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OldAccount_studentId_key" ON "OldAccount"("studentId");
