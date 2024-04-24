import { Link } from "react-router-dom";
import { Paths } from "../../routes/routes";
import { ImageBox } from "../common/ImageBox";
import { PostResponse, Tag } from "../types";
import { createPostUrl } from "./helpers";

interface Props {
  post: PostResponse;
  index: number;
  highlight: boolean;
}

export const PostCard = ({ post, index, highlight }: Props) => {
  console.log(post);
  if (!post?.author) {
    return null;
  }

  return (
    <div>
      {index === 0 && highlight && (
        <Link to={createPostUrl(post.author.nameId, post.id)}>
          <div className="relative w-full pt-[42%] rounded-t-md">
            <ImageBox img={post.file} />
          </div>
        </Link>
      )}
      <div className="bg-container-light dark:bg-container-dark p-5 rounded-md shadow-outline">
        <div className="grid grid-flow-col grid-cols-[130px,1fr]">
          <Link className="flex" to={Paths.HOME + post.author.nameId}>
            <img
              className="mr-2 mt-1 rounded-[50%] h-8 w-8"
              src={post.author.photoURL}
              alt={post.author.displayName}
            />
            <div className="block">
              <p className="text-m">{post.author.displayName}</p>
              <p className="text-sm mb-2">{post.createdAt}</p>
            </div>
          </Link>
          <Link
            className="block h-full w-full"
            to={createPostUrl(post.author.nameId, post.id)}
          />
        </div>
        <Link
          className="block pl-10 cursor-pointer"
          to={createPostUrl(post.author.nameId, post.id)}
        >
          <h2 className="text-2xl font-bold pb-2">{post.title}</h2>
          <div className="pb-8">
            {post.tags?.map((tag: Tag, index: number) => (
              <span key={index} className="mr-4 text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex">
            <span className="mr-6">{post.likeCount} Reactions</span>
            <span>{post.commentCount} Comments</span>
            <span className="ml-auto">{post.readTime} min read</span>
          </div>
        </Link>
      </div>
    </div>
  );
};
