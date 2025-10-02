import { readMyPostsAction } from "@/actions";
import { PostsInfiniteScroll } from "@/app/(alumni)/posts/__components/posts-infinite-scroll";
import React from "react";

export default async function Page() {
  const posts = await readMyPostsAction({
    pagination: {
      page: 0,
      limit: 10,
    },
  });

  return <PostsInfiniteScroll defaultData={posts.data} />;
}
