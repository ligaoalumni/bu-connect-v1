"use client";

import { likeAnnouncementAction, unlikeAnnouncementAction } from "@/actions";
import {
  AnnouncementCommentsSection,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Reactions,
  RichTextEditor,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { useAuth, useContentData } from "@/contexts";
import { Announcement as TAnnouncement } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function Announcement({
  announcement,
  comments,
  likedByIds,
  backToPath,
  likes,
}: {
  announcement: TAnnouncement;
  likes: number;
  comments: number;
  likedByIds: number[];
  backToPath: string;
}) {
  const { setData, data } = useContentData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (announcement.id) {
      setData({
        comments,
        id: announcement.id,
        likes,
        isLiked: likedByIds.includes(Number(user?.id)),
      });
    }
  }, [announcement.id, user?.id]);

  const handleLike = async () => {
    try {
      if (!user) {
        return toast.error("You must be logged in to like an announcement.", {
          description: "Please log in and try again.",
          duration: 5000,
          richColors: true,
          position: "top-center",
          action: (
            <Button asChild variant="ghost">
              <Link href="/login">Log In</Link>
            </Button>
          ),
        });
      }
      setLoading(true);
      if (data?.isLiked) {
        setData({
          comments,
          id: announcement.id,
          likes: (data?.likes || likes) - 1,
          isLiked: false,
        });
        await unlikeAnnouncementAction(announcement.id, announcement.slug);
      } else {
        setData({
          comments,
          id: announcement.id,
          likes: (data?.likes || likes) + 1,
          isLiked: true,
        });
        await likeAnnouncementAction(announcement.id, announcement.slug);
      }
    } catch (error) {
      console.error("Error liking announcement:", error);
      if (data?.isLiked) {
        setData({
          comments,
          id: announcement.id,
          likes: (data?.likes || likes) - 1,
          isLiked: false,
        });
      } else {
        setData({
          comments,
          id: announcement.id,
          likes: (data?.likes || likes) + 1,
          isLiked: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="overflow-hidden bg-transparent shadow-none border-none hover:shadow-sm transition-shadow duration-300 ease-in-out">
        <CardHeader>
          <div className="flex items-center space-x-4 p-4">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button size="icon" asChild>
                    <Link href="/highlights">
                      <ChevronLeft />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Back to {backToPath}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div>
              <h2 className="text-lg font-semibold">{announcement.title}</h2>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(announcement.createdAt))} ago
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className=" ">
          <div className="relative aspect-video w-full">
            <Image
              src={announcement?.image || `/images/placeholder.jpg`}
              alt={announcement.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <RichTextEditor content={announcement.content} />
        </CardContent>
        <CardFooter>
          <Reactions
            isLoading={loading}
            handleLike={handleLike}
            comments={data?.comments || comments}
            likes={data?.likes || likes}
            isLiked={data?.isLiked || likedByIds.includes(Number(user?.id))}
          />
        </CardFooter>
      </Card>
      <div className="space-y-4 mt-4 px-6">
        <AnnouncementCommentsSection announcementId={announcement.id} />
      </div>
    </div>
  );
}
