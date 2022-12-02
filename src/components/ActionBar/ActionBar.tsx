import { useEffect, useState } from "react";
import { database } from "../../service/firebase";
import { useUserContext } from "../auth/UserContext";

interface Props {
  postId: string | undefined;
}

export const ActionBar = ({ postId }: Props) => {
  const user = useUserContext();
  const [likesCount, setLikesCount] = useState<string>();
  const [bookmarksCount, setBookmarksCount] = useState<string>();
  const [dataUpdating, setDataUpdating] = useState(false);
  const [userHasBookmark, setUserHasBookmark] = useState(false);
  const [userHasLiked, setUserHasLiked] = useState(false);

  const registerReaction = async () => {
    if (!user || !postId) return;
    setDataUpdating(true);
    await database
      .registerLikeOrDislike(postId, user.uid)
      .then(() => setDataUpdating(false));
  };

  const registerBookmark = async () => {
    if (!user || !postId) return;
    setDataUpdating(true);
    await database
      .registerBookmarkOrUnmark(postId, user.uid)
      .then(() => setDataUpdating(false));
  };

  useEffect(() => {
    if (!user || !postId) return;
    database.getPostLikeCount(postId).then((result) => setLikesCount(result));
    database
      .getBookmarkCount(postId)
      .then((result) => setBookmarksCount(result));
    if (user) {
      database
        .checkIfUserHasBookmarkedPost(postId, user.uid)
        .then((result) => setUserHasBookmark(result));
      database
        .checkIfUserHasLikedPost(postId, user.uid)
        .then((result) => setUserHasLiked(result));
    }
  }, [dataUpdating, user, postId]);
  return (
    <div className="relative w-full h-full md:block hidden">
      <div className="sticky top-20">
        <div className="grid gap-y-6 transition-all duration-75 ease-in-out">
          <button
            className="relative flex flex-col items-center group"
            onClick={() => registerReaction()}
          >
            <span
              className={`${
                userHasLiked && "bg-red-200"
              } p-2 rounded-[50%] text-default bg-transparent group-hover:bg-red-200 transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
                className="crayons-icon"
              >
                <path d="M21.179 12.794l.013.014L12 22l-9.192-9.192.013-.014A6.5 6.5 0 0112 3.64a6.5 6.5 0 019.179 9.154zM4.575 5.383a4.5 4.5 0 000 6.364L12 19.172l7.425-7.425a4.5 4.5 0 10-6.364-6.364L8.818 9.626 7.404 8.21l3.162-3.162a4.5 4.5 0 00-5.99.334l-.001.001z"></path>
              </svg>
            </span>
            <span
              className={`${
                userHasLiked && "text-red-500"
              } min-w-auto block text-default group-hover:text-red-500`}
            >
              {likesCount ?? "0"}
            </span>
          </button>
          <button className="relative flex flex-col items-center">
            <span className="p-2 rounded-[50%] text-default bg-transparent hover:bg-green-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
                className="crayons-icon"
              >
                <path d="M10 3h4a8 8 0 010 16v3.5c-5-2-12-5-12-11.5a8 8 0 018-8zm2 14h2a6 6 0 000-12h-4a6 6 0 00-6 6c0 3.61 2.462 5.966 8 8.48V17z"></path>
              </svg>
            </span>
            <span className="min-w-auto block text-default">0</span>
          </button>
          <button
            className="relative flex flex-col items-center group"
            onClick={() => registerBookmark()}
          >
            <span
              className={`${
                userHasBookmark && "bg-blue-200"
              } p-2 rounded-[50%] text-default bg-transparent group-hover:bg-blue-200 transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
                className="crayons-icon"
              >
                <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1zm13 2H6v15.432l6-3.761 6 3.761V4z"></path>
              </svg>
            </span>
            <span
              className={`${
                userHasBookmark && "text-blue-500"
              } min-w-auto block text-default group-hover:text-blue-500`}
            >
              {bookmarksCount ?? "0"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
