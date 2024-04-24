import { PostResponse } from "../types";
import { PostCard } from "./PostCard";

interface Props {
  posts: PostResponse[];
  highlight?: boolean;
}

export const PostListing = ({ posts, highlight = true }: Props) => {
  // const filterLatest = hasFilterLatestInUrl();
  posts.sort((a, b) => {
    const dateA = a.createdAt.split("-").reverse().join("-");
    const dateB = b.createdAt.split("-").reverse().join("-");
    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
  });

  return (
    <div className="grid gap-y-2">
      {posts
        .map((post: PostResponse, index: number) => (
          <PostCard
            key={post?.id + index}
            post={post}
            index={index}
            highlight={highlight}
          />
        ))}
    </div>
  );
};
