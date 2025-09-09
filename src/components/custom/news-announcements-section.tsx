import { readAnnouncementsAction } from "@/actions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Announcement } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export async function NewsAndAnnouncementsSection() {
  const announcemenets = await readAnnouncementsAction({
    orderBy: "createdAt",
    order: "desc",
    pagination: {
      limit: 3,
      page: 0,
    },
  });

  return (
    <section className="px-5 md:px-0">
      <div className=" container mx-auto bg-[#195287]  py-10">
        <div className="flex  items-center gap-3 justify-center">
          <Icon icon="fluent-color:megaphone-loud-16" width="24" height="24" />
          <h1 className="text-[#E6750C] text-2xl font-bold">
            News &#x26; Announcesments
          </h1>
        </div>

        <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-5 py-10">
          {!(announcemenets.data.length > 0) ? (
            announcemenets.data.map((announcement) => (
              <AnnouncementCard
                announcement={announcement}
                key={announcement.id}
              />
            ))
          ) : (
            <div className="flex items-center justify-center w-full min-h-[300px] md:col-span-3">
              {/*<Loader2 className="h-20 animate-spin" />*/}
              <div className="flex flex-col items-center gap-3">
                <Icon
                  icon="mage:folder-cross"
                  width="100"
                  height="100"
                  color="#FFFFFF"
                />
                <p className="text-white text-lg">No Announcements Found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { title } = announcement;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-video w-full">
        <Image
          src={`/images/placeholder.jpg`}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-balance">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
