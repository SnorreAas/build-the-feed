import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserResponse } from "../components/types";
import { Sidebar } from "../components/Sidebar";
import { SidebarContainer } from "../components/Sidebar/SidebarContainer";
import { TwoColumnLayout } from "../components/TwoColumnLayout";
import { useMount } from "../hooks/useMount";
import { database } from "../service/firebase/FirebaseRealtimDB";
import { useUserContext } from "../components/auth/UserContext";
import { Button } from "../components/common/Button";
import { ButtonVariant } from "../components/common/Button/Button";
import { PostListing } from "../components/PostListing";
import { Paths } from "./routes";
import { isLoggedInUserProfile } from "../components/auth/helpers";
import { getUserIdFromUrl } from "../components/helpers";

export const Profile = () => {
  const [profile, setProfile] = useState<UserResponse | undefined>();
  const [followerCount, setFollowerCount] = useState<string | undefined>();
  const [userHasFollowed, setUserHasFollowed] = useState(false);
  const [dataUpdating, setDataUpdating] = useState(false);

  const location = useLocation();
  const user = useUserContext();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const pathName = location.pathname;
    const nameId = getUserIdFromUrl(pathName);
    if (nameId === undefined) return;
    await database
      .getUserByNameId(nameId)
      .then((data) => {
        setProfile(data);
        setFollowerCount(data?.followerCount);
      })
      .catch(() => navigate(Paths.HOME));
  };

  const registerFollow = async () => {
    if (user && profile && profile.uid) {
      setDataUpdating(true);
      await database
        .registerFollowOrUnFollow(user.uid, profile.uid)
        .then(() => setDataUpdating(false));
      database
        .getUserFollowerCount(profile.uid)
        .then((result) => setFollowerCount(result));
    }
  };

  useMount(() => {
    fetchProfile();
  });

  useEffect(() => {
    if (user && profile && profile.uid) {
      database
        .checkIfUserHasFollowed(user.uid, profile.uid)
        .then((result) => setUserHasFollowed(result));
    }
  }, [user, profile, dataUpdating]);

  if (!profile) {
    return null;
  }

  return (
    <div>
      <div className="lg:h-24 md:h-16 h-10 bg-blue-900" />
      <div className="md:mt-[-50px] mt-[-30px]">
        <TwoColumnLayout>
          <div className="hidden md:block">
            <Sidebar>
              <SidebarContainer>
                <div className="grid grid-flow-row gap-y-4">
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-labelledby="at7s7bi6m1afezl4x41qu33032jqhhl"
                      className="crayons-icon mr-3 color-base-50"
                    >
                      <title id="at7s7bi6m1afezl4x41qu33032jqhhl">Post</title>
                      <path d="M19 22H5a3 3 0 01-3-3V3a1 1 0 011-1h14a1 1 0 011 1v12h4v4a3 3 0 01-3 3zm-1-5v2a1 1 0 002 0v-2h-2zm-2 3V4H4v15a1 1 0 001 1h11zM6 7h8v2H6V7zm0 4h8v2H6v-2zm0 4h5v2H6v-2z"></path>
                    </svg>
                    {profile.postCount} posts published
                  </div>
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-labelledby="afbviu58593hadjm5ux4msd7p5acn7gr"
                      className="crayons-icon mr-3 color-base-50"
                    >
                      <title id="afbviu58593hadjm5ux4msd7p5acn7gr">
                        Comment
                      </title>
                      <path d="M10 3h4a8 8 0 010 16v3.5c-5-2-12-5-12-11.5a8 8 0 018-8zm2 14h2a6 6 0 000-12h-4a6 6 0 00-6 6c0 3.61 2.462 5.966 8 8.48V17z"></path>
                    </svg>
                    {profile.commentCount} comments written
                  </div>
                </div>
              </SidebarContainer>
            </Sidebar>
          </div>
          <div>
            <SidebarContainer>
              <div className="md:flex block">
                <img
                  className="mr-2 rounded-[50%] lg:h-28 lg:w-28 md:h-14 md:w-14 h-12 w-12 lg:mt-[-40px] md:mt-[-30px] mt-[-35px] border-solid border-4 border-white"
                  src={profile.photoURL}
                  alt={profile.displayName}
                />
                <div className="block pl-4 pr-4">
                  <p className="text-3xl font-bold pb-2">
                    {profile.displayName}
                  </p>
                  {profile.bio && <p className="text-lg pb-3">{profile.bio}</p>}
                  <p className="pt-2">
                    <strong className="my-auto">{followerCount ?? "0"}</strong>
                    <span className="my-auto"> Followers</span>
                  </p>
                </div>
                <div className="md:ml-auto md:pt-0 pt-4 max-w-[150px] md:pl-0 pl-4">
                  {isLoggedInUserProfile(user?.uid, profile.uid) && (
                    <Button text="Edit" variant={ButtonVariant.FILLED} />
                  )}
                  {!isLoggedInUserProfile(user?.uid, profile.uid) && (
                    <Button
                      onClick={() => registerFollow()}
                      text={userHasFollowed ? "Following" : "Follow"}
                      variant={
                        userHasFollowed
                          ? ButtonVariant.OUTLINED
                          : ButtonVariant.FILLED
                      }
                    />
                  )}
                </div>
              </div>
            </SidebarContainer>
            {profile.posts && (
              <PostListing posts={profile.posts} highlight={false} />
            )}
          </div>
        </TwoColumnLayout>
      </div>
    </div>
  );
};
