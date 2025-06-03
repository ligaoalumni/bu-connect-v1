/*
  Warnings:

  - You are about to alter the column `rate` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "rate" SET DATA TYPE DECIMAL(65,30);
