/*
  Warnings:

  - You are about to drop the column `title` on the `recruitments` table. All the data in the column will be lost.
  - Added the required column `eventTitle` to the `recruitments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recruiting` to the `recruitments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recruitments" DROP COLUMN "title",
ADD COLUMN     "eventTitle" TEXT NOT NULL,
ADD COLUMN     "recruiting" TEXT NOT NULL;
