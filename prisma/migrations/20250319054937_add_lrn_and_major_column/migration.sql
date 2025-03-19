/*
  Warnings:

  - A unique constraint covering the columns `[lrn]` on the table `alumni_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lrn` to the `alumni_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alumni_accounts" ADD COLUMN     "lrn" TEXT NOT NULL,
ADD COLUMN     "major" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "alumni_accounts_lrn_key" ON "alumni_accounts"("lrn");
