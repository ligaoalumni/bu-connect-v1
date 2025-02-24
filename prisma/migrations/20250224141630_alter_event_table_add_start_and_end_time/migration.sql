/*
  Warnings:

  - Added the required column `endTime` to the `Alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Alumni` table without a default value. This is not possible if the table is not empty.
  - Made the column `endDate` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Alumni" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "endDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;
