import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMount } from "../../hooks/useMount";
import { database } from "../../service/firebase/FirebaseRealtimDB";
import { ImageBox } from "../common/ImageBox";
import { createPostUrl } from "./helpers";
import { PostResponse, Tag } from "./types";

interface Props {
  post: PostResponse;
  index: number;
}

export const PostCard = ({ post, index }: Props) => {
  const [likesCount, setLikesCount] = useState<string>();

  const navigate = useNavigate();

  useMount(() => {
    // TODO: make getAllPosts set this value
    database.getPostLikeCount(post.id).then((result) => setLikesCount(result));
  });

  if (!post.author) {
    return null;
  }

  return (
    <div
      className="cursor-pointer"
      onClick={() =>
        navigate(createPostUrl(post.author.displayName, post.id), {
          state: { id: post.id },
        })
      }
    >
      {index === 0 && (
        <div className="relative w-full pt-[42%] rounded-t-md">
          <ImageBox img={post.file} />
        </div>
      )}
      <div className="p-5 rounded-md bg-white shadow-outline">
        <div className="flex">
          <img
            className="mr-2 mt-1 rounded-[50%] h-8 w-8"
            src={post.author.photoURL ?? ""}
            alt={post.author.displayName ?? ""}
          />
          <div className="block">
            <p className="text-m">{post.author.displayName}</p>
            <p className="text-sm mb-2">{post.createdAt}</p>
          </div>
        </div>
        <div className="pl-10">
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <div className="mb-8">
            {post.tags?.map((tag: Tag, index: number) => (
              <span key={index} className="mr-4 text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex">
            <span className="mr-6">{likesCount ?? "0"} Reactions</span>
            <span>0 Comments</span>
            <span className="ml-auto">{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
};
