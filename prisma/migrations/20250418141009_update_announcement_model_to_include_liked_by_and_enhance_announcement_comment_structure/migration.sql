-- CreateTable
CREATE TABLE "announcement_comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "announcementId" INTEGER NOT NULL,
    "commentById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnnouncementLikes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnnouncementLikes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Announcement_slug_key" ON "Announcement"("slug");

-- CreateIndex
CREATE INDEX "_AnnouncementLikes_B_index" ON "_AnnouncementLikes"("B");

-- AddForeignKey
ALTER TABLE "announcement_comments" ADD CONSTRAINT "announcement_comments_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_comments" ADD CONSTRAINT "announcement_comments_commentById_fkey" FOREIGN KEY ("commentById") REFERENCES "alumni_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementLikes" ADD CONSTRAINT "_AnnouncementLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "alumni_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementLikes" ADD CONSTRAINT "_AnnouncementLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
