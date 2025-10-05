import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Announcement } from "@prisma/client";
import Image from "next/image";

interface AnnouncementCardProps {
  announcement: Announcement;
}
export default function MiniAnnouncementCard({
  announcement,
}: AnnouncementCardProps) {
  const { title, image } = announcement;

  return (
    <Link href={`/announcements/${announcement.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative aspect-video w-full">
          <Image
            src={image || `/images/placeholder.jpg`}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <CardTitle className="font-inter text-lg font-bold text-balance">
            {title}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
