import { readPostsAction } from "@/actions";
import { PostsInfiniteScroll } from "@/app/(alumni)/posts/__components/posts-infinite-scroll";
import React from "react";

export default async function Page() {
  const posts = await readPostsAction({
    pagination: {
      page: 0,
      limit: 8,
    },
    order: "desc",
    orderBy: "createdAt",
  });

  return (
    <PostsInfiniteScroll defaultData={posts.data} moreData={posts.hasMore} />
  );
}
