import Link from "next/link";
import { Paths } from "../../../old-react/routes/routes";
import { useUserContext } from "../../auth/UserContext";
import { createUserIdFromName } from "../../PostListing/helpers";

export const ProfileMenu = () => {
  const user = useUserContext();

  if (!user) {
    return null;
  }

  return (
    <Link
      className="block my-auto w-full ml-2"
      href={Paths.HOME + createUserIdFromName(user.displayName)}
    >
      <img
        className="rounded-[50%] h-8 w-8"
        src={user.photoURL ?? ""}
        alt={user.displayName ?? ""}
      />
    </Link>
  );
};
