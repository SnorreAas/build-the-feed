import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArticleLayout } from "../components/ArticleLayout";
import { ImageBox } from "../components/common/ImageBox";
import { MainContainer } from "../components/Main/MainContainer";
import { PostResponse, Tag } from "../components/types";
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
import { Paths } from "./routes";
import { getPostIdFromUrl } from "../components/helpers";
import { ButtonFollow } from "../components/ButtonFollow";
import { useUserContext } from "../components/auth/UserContext";
import { isLoggedInUserProfile } from "../components/auth/helpers";

export const Article = (): JSX.Element | null => {
  const [post, setPost] = useState<PostResponse>();
  const location = useLocation();
  const user = useUserContext();

  const fetchPost = async () => {
    const postId = getPostIdFromUrl(location.pathname);
    if (!postId) return;
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
      <ActionBar
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        bookmarkCount={post.bookmarkCount}
      />
      <div>
        <div className="relative w-full pt-[42%] rounded-t-md">
          <ImageBox img={post.file} />
        </div>
        <MainContainer>
          <>
            <Link
              className="flex cursor-pointer"
              to={Paths.HOME + post.author.nameId}
            >
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
              <Link
                className="flex mt-[-30px]"
                to={Paths.HOME + post.author.nameId}
              >
                <img
                  className="mr-2 rounded-[50%] h-12 w-12"
                  src={post.author.photoURL}
                  alt={post.author.displayName}
                />
                <div className="block mt-5">
                  <p className="text-xl font-bold">{post.author.displayName}</p>
                </div>
              </Link>
              <div className="mt-5">
                {!isLoggedInUserProfile(user?.uid, post.author.uid) && (
                  <ButtonFollow userId={user?.uid} checkId={post.author.uid} />
                )}
                {isLoggedInUserProfile(user?.uid, post.author.uid) && (
                  <Button
                    text="Got to profile"
                    variant={ButtonVariant.FILLED}
                    route={Paths.HOME + post.author.nameId}
                  />
                )}
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
