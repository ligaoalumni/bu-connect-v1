-- DropIndex
DROP INDEX "alumni_accounts_qrCode_key";

-- AlterTable
ALTER TABLE "alumni" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "course" TEXT,
ADD COLUMN     "furtherEducation" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "schoolName" TEXT,
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nationality" TEXT DEFAULT '',
ADD COLUMN     "religion" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "event_comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "commentById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_commentById_fkey" FOREIGN KEY ("commentById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
