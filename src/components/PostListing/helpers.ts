import { Paths } from "../../old-react/routes/routes";

export const createUserIdFromName = (
  userName: string | null
): string | undefined => {
  if (userName === null) return undefined;
  const formattedUser = userName?.split(" ").join("").toLowerCase();
  return formattedUser;
};

export const createPostUrl = (userName: string, title: string) => {
  if (!userName || !title) return Paths.HOME;
  const userUrl = createUserIdFromName(userName);
  return `/${userUrl}/${title}/`;
};
