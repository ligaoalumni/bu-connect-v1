/*
  Warnings:

  - You are about to alter the column `rate` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(1,1)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "rate" DROP DEFAULT,
ALTER COLUMN "rate" SET DATA TYPE DECIMAL(1,1);
