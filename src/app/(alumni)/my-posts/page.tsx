import { readMyPostsAction } from "@/actions";
import { LoaderComponent } from "@/components";
import dynamic from "next/dynamic";

const PostsInfiniteScroll = dynamic(
  () =>
    import("../posts/__components/posts-infinite-scroll").then(
      (mod) => mod.PostsInfiniteScroll,
    ),
  {
    loading: LoaderComponent,
  },
);

export default async function Page() {
  const posts = await readMyPostsAction({
    pagination: {
      page: 0,
      limit: 10,
    },
  });

  return <PostsInfiniteScroll defaultData={posts.data} />;
}
