import { readAlumniMemoriesAction, readAnnouncementsAction } from "@/actions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Announcement } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export async function NewsAndAnnouncementsSection() {
  const announcemenets = await readAnnouncementsAction({
    orderBy: "createdAt",
    order: "desc",
    pagination: {
      limit: 3,
      page: 0,
    },
  });
  const images = await readAlumniMemoriesAction(3);

  return (
    <section className="">
      <div className="px-5 md:px-10 container mx-auto bg-[#195287]  py-10">
        <div className="flex  items-center gap-3 justify-center">
          <Icon icon="fluent-color:megaphone-loud-16" width="24" height="24" />
          <h1 className="text-[#E6750C] text-2xl font-bold uppercase">
            News &#x26; Announcesments
          </h1>
        </div>

        <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-5 py-10">
          {!(announcemenets.data.length > 0) ? (
            announcemenets.data.map((announcement) => (
              <MiniAnnouncementCard
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

      {images.length > 0 && (
        <div className="px-5 md:px-10 container mx-auto bg-[#195287]  py-10">
          <div className="flex  items-center gap-3 justify-center">
            <Icon
              icon="fluent-emoji-flat:camera-with-flash"
              width="24"
              height="24"
            />
            <h1 className="text-[#E6750C] text-2xl font-bold uppercase">
              Alumni Memories
            </h1>
          </div>

          <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-5 py-10">
            {images.map((image, index) => (
              <div
                key={`Alumni Memory Card #${index + 1}`}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "408px",
                }}
              >
                <Image
                  src={image || "/images/placeholder.jpg"}
                  alt={`Alumni Memory ${index + 1}`}
                  width={408}
                  height={375}
                  layout="responsive"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function MiniAnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { title } = announcement;

  return (
    <Link href={`/announcements/${announcement.id}`}>
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
    </Link>
  );
}
