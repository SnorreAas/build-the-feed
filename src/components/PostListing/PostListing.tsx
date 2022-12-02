import { PostCard } from "./PostCard";
import { PostResponse } from "./types";

interface Props {
  posts: PostResponse[];
}

export const PostListing = ({ posts }: Props) => {
  return (
    <div className="grid gap-y-2">
      {posts.map((post: PostResponse, index: number) => (
        <PostCard key={index} post={posts[index]} index={index} />
      ))}
    </div>
  );
};
