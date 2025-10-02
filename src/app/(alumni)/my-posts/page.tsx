import { readPostsAction } from "@/actions";
import { PostsInfiniteScroll } from "../posts/__components/posts-infinite-scroll";

export default async function Page() {
  const posts = await readPostsAction({
    pagination: {
      page: 0,
      limit: 10,
    },
  });

  return <PostsInfiniteScroll defaultData={posts.data} />;
}
