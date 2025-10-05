import { readPostsAction } from "@/actions";

import React from "react";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const PostsInfiniteScroll = dynamic(
  () =>
    import("@/app/(alumni)/posts/__components/posts-infinite-scroll").then(
      (mod) => mod.PostsInfiniteScroll,
    ),
  {
    loading: LoaderComponent,
  },
);

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
