import { useState } from "react";
import {
  FlexDirections,
  SignInButtons,
} from "../components/auth/SignInButtons";
import { ImageBox } from "../components/common/ImageBox";
import { CreatePostButton } from "../components/CreatePostButton";
import { Main } from "../components/Main";
import { ThreeColumnLayout } from "../components/ThreeColumnLayout";
import { PostListing } from "../components/PostListing";
import { Sidebar } from "../components/Sidebar";
import { SidebarContainer } from "../components/Sidebar/SidebarContainer";
import { useMount } from "../hooks/useMount";
import { database } from "../service/firebase/FirebaseRealtimDB";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [userCount, setUserCount] = useState<string | undefined>("0");

  const fetchAllPosts = async () => {
    await database.getAllPosts().then((data: any) => setPosts(data));
  };

  const fetchUserCount = async () => {
    await database.getUserCount().then((result) => setUserCount(result));
  };

  useMount(() => {
    fetchUserCount();
    fetchAllPosts();
  });

  return (
    <ThreeColumnLayout>
      <Sidebar>
        <SidebarContainer>
          <h2 className="mb-4 text-[1.25rem] font-bold">
            BTF Community 👩‍💻👨‍💻 is a community of {userCount} amazing developers{" "}
          </h2>
          <p className="mb-4">
            We're a place where coders share, stay up-to-date and grow their
            careers.
          </p>
          <div className="mb-4">
            <SignInButtons flex={FlexDirections.COLUMN} />
            <CreatePostButton />
          </div>
        </SidebarContainer>
      </Sidebar>
      <Main>
        <PostListing posts={posts} />
      </Main>
      <Sidebar>
        <div className="lg:block hidden">
          <div className=" relative w-full pt-[50%] rounded-t-md">
            <ImageBox img="https://i0.wp.com/css-tricks.com/wp-content/uploads/2021/12/default-social-css-tricks.png" />
          </div>
          <SidebarContainer>test</SidebarContainer>
        </div>
      </Sidebar>
    </ThreeColumnLayout>
  );
};
