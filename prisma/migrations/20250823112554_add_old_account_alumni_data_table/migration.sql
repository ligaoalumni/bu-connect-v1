-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isOldAccount" BOOLEAN DEFAULT false,
ADD COLUMN     "oldAccountId" INTEGER;

-- CreateTable
CREATE TABLE "OldAccount" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "birthDat" TIMESTAMP(3) NOT NULL,
    "program" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OldAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_oldAccountId_fkey" FOREIGN KEY ("oldAccountId") REFERENCES "OldAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
