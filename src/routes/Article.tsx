import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ArticleLayout } from "../components/ArticleLayout";
import { ImageBox } from "../components/common/ImageBox";
import { MainContainer } from "../components/Main/MainContainer";
import { PostResponse, Tag } from "../components/PostListing/types";
import { useMount } from "../hooks/useMount";
import { database } from "../service/firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ActionBar } from "../components/ActionBar";
import { SidebarContainer } from "../components/Sidebar/SidebarContainer";
import { Button } from "../components/common/Button";
import { ButtonVariant } from "../components/common/Button/Button";

export const Article = (): JSX.Element | null => {
  const [post, setPost] = useState<PostResponse>();
  const location = useLocation();

  const getPostIdFromUrl = () => {
    const pathName = location.pathname;
    return pathName.split("/").filter(Boolean).pop();
  };

  const fetchPost = async () => {
    const postId = location.state ? location.state.id : getPostIdFromUrl();
    // Make getPostById return reaction counts
    await database.getPostById(postId).then((result) => setPost(result));
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("-") as any;
    return new Date(+year, month - 1, 0);
  };

  useMount(() => {
    fetchPost();
  });

  if (!post) {
    return null;
  }

  return (
    <ArticleLayout>
      {/* Send in post.likesCount & post.bookmarksCount and useState in there on mount */}
      <ActionBar postId={post.id} />
      <div>
        <div className="relative w-full pt-[42%] rounded-t-md">
          <ImageBox img={post.file} />
        </div>
        <MainContainer>
          <>
            <div className="flex">
              <img
                className="mr-2 mt-1 rounded-[50%] h-8 w-8"
                src={post.author.photoURL ?? ""}
                alt={post.author.photoURL?.toString() ?? ""}
              />
              <div className="block">
                <p className="text-m">{post.author.displayName}</p>
                <p className="text-sm mb-2">{post.createdAt}</p>
              </div>
            </div>
            <div className="">
              <h2 className="text-4xl font-bold mb-6">{post.title}</h2>
              <div className="mb-8">
                {post.tags?.map((tag: Tag, index: number) => (
                  <span key={index} className="mr-4 text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  children={post.content}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, "")}
                          style={duotoneDark as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                />
              </div>
            </div>
          </>
        </MainContainer>
      </div>
      <div className="relative w-full h-full lg:block hidden">
        <div className="sticky top-[70px]">
          <div className="block h-8 w-full rounded-t-md bg-blue-900" />
          <SidebarContainer>
            <div>
              <div className="flex mt-[-30px]">
                <img
                  className="mr-2 rounded-[50%] h-12 w-12"
                  src={post.author.photoURL ?? ""}
                  alt={post.author.photoURL?.toString() ?? ""}
                />
                <div className="block mt-5">
                  <p className="text-xl font-bold">{post.author.displayName}</p>
                </div>
              </div>
              <div className="mt-5">
                <Button variant={ButtonVariant.OUTLINED} text="Follow" />
              </div>
            </div>
          </SidebarContainer>
          <SidebarContainer>
            <p>Joined {post.author.createdAt}</p>
          </SidebarContainer>
        </div>
      </div>
    </ArticleLayout>
  );
};
