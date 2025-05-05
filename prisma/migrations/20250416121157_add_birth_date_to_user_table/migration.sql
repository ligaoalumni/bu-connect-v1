-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT DEFAULT '',
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "contactNumber" TEXT DEFAULT '',
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'PREFER_NOT_TO_SAY';
