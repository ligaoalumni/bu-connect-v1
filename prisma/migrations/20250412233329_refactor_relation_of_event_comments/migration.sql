-- DropForeignKey
ALTER TABLE "event_comments" DROP CONSTRAINT "event_comments_commentById_fkey";

-- AddForeignKey
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_commentById_fkey" FOREIGN KEY ("commentById") REFERENCES "alumni_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
