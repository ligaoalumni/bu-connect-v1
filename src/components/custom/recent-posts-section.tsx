"use client";
import { useContentData } from "@/contexts";
import { TPost } from "@/types";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { MiniPostCard } from "./mini-post-card";

interface RecentPostsSectionProps {
  defaultData?: TPost[];
}

export default function RecentPostsSection({
  defaultData,
}: RecentPostsSectionProps) {
  const { setPosts, posts } = useContentData();
  useEffect(() => {
    setPosts(defaultData || []);
  }, [defaultData]);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <Icon icon="emojione-v1:note-pad" width="32" height="32" />
        <h1 className="font-poppins text-2xl md:text-3xl font-bold  text-[#E6750C]  ">
          Recent Posts
        </h1>
      </div>
      <div className="space-y-5 mt-5 ">
        {(posts || defaultData).length > 0 ? (
          (posts || defaultData).map((post) => (
            <div
              className="mx-auto max-w-screen-md"
              key={`post-card-container-${post.id}`}
            >
              <MiniPostCard
                postedById={post.postedById}
                key={post.id}
                likedByIds={post.likedBy.map((i) => i.id) || []}
                post={{
                  images: post.images,
                  id: post.id,
                  avatar: post.postedBy.image || "",
                  name: `${post.postedBy.firstName} ${post.postedBy.lastName}`,
                  batch: post.postedBy.batch || 0,
                  comments_count: post._count.comments,
                  content: post.title,
                  likes_count: post._count.comments,
                  slug: post.slug,
                  createdAt: post.createdAt.toISOString(),
                }}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col min-h-[100px] items-center justify-center">
            <Icon
              icon="mage:folder-cross"
              width="50"
              height="50"
              style={{ color: "#195287" }}
            />
            <p>No recent posts</p>
          </div>
        )}
      </div>
    </div>
  );
}
