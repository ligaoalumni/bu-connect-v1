/*
  Warnings:

  - You are about to drop the column `coverImg` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "coverImg",
ADD COLUMN     "images" TEXT[];
