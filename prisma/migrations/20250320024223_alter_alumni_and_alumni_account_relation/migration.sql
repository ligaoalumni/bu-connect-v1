/*
  Warnings:

  - You are about to drop the column `alumniId` on the `alumni` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "alumni" DROP CONSTRAINT "alumni_alumniId_fkey";

-- DropIndex
DROP INDEX "alumni_alumniId_key";

-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "alumniId";

-- AddForeignKey
ALTER TABLE "alumni_accounts" ADD CONSTRAINT "alumni_accounts_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "alumni"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
