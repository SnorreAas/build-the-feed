import { Link } from "react-router-dom";
import { Paths } from "../../../routes/routes";
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
      to={Paths.HOME + createUserIdFromName(user.displayName)}
    >
      <img
        className="rounded-[50%] h-8 w-8"
        src={user.photoURL ?? ""}
        alt={user.displayName ?? ""}
      />
    </Link>
  );
};
