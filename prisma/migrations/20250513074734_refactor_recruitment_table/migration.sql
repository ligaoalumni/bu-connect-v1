/*
  Warnings:

  - You are about to drop the column `company` on the `recruitments` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `recruitments` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `recruitments` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `recruitments` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `recruitments` table. All the data in the column will be lost.
  - Added the required column `date` to the `recruitments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry` to the `recruitments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topics` to the `recruitments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recruitments" DROP COLUMN "company",
DROP COLUMN "description",
DROP COLUMN "jobTitle",
DROP COLUMN "location",
DROP COLUMN "type",
ADD COLUMN     "allowedBatches" INTEGER[],
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "industry" TEXT NOT NULL,
ADD COLUMN     "topics" TEXT NOT NULL;
