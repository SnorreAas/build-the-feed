import { Paths } from "../../routes/routes";

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

export const hasFilterLatestInUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const search = params.get("filter");
  return search === "latest";
}
