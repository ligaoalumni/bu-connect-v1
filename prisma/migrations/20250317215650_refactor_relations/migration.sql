/*
  Warnings:

  - You are about to drop the column `createdAt` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `qrCode` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `alumniId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `alumni` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lrn]` on the table `alumni` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[alumniId]` on the table `alumni` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthDate` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lrn` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleName` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED', 'DELETED');

-- DropForeignKey
ALTER TABLE "_EventAttendees" DROP CONSTRAINT "_EventAttendees_A_fkey";

-- DropForeignKey
ALTER TABLE "_InterestEvent" DROP CONSTRAINT "_InterestEvent_A_fkey";

-- DropForeignKey
ALTER TABLE "alumni" DROP CONSTRAINT "alumni_userId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_alumniId_fkey";

-- DropIndex
DROP INDEX "alumni_email_key";

-- DropIndex
DROP INDEX "alumni_qrCode_key";

-- DropIndex
DROP INDEX "alumni_userId_key";

-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "major",
DROP COLUMN "qrCode",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "alumniId" INTEGER,
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lrn" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "alumniId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "students";

-- CreateTable
CREATE TABLE "alumni_accounts" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "graduationYear" INTEGER NOT NULL,
    "major" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "alumniId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alumni_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alumni_accounts_email_key" ON "alumni_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_accounts_qrCode_key" ON "alumni_accounts"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_accounts_alumniId_key" ON "alumni_accounts"("alumniId");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_accounts_userId_key" ON "alumni_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_studentId_key" ON "alumni"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_lrn_key" ON "alumni"("lrn");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_alumniId_key" ON "alumni"("alumniId");

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "alumni_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni_accounts" ADD CONSTRAINT "alumni_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestEvent" ADD CONSTRAINT "_InterestEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "alumni_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventAttendees" ADD CONSTRAINT "_EventAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES "alumni_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
