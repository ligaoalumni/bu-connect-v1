/*
  Warnings:

  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EVENT', 'ANNOUNCEMENT', 'POST', 'JOB', 'COMMENT', 'LIKE', 'RECRUITMENT', 'POLL', 'RECRUITMENT_APPLICATION');

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "link" TEXT,
ADD COLUMN     "type" "NotificationType" NOT NULL;
