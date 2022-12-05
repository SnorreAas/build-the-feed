import { Logo } from "../common/Logo";
import { FlexDirections, SignInButtons } from "../auth/SignInButtons";
import { LogoutButton } from "../auth/LogoutButton";
import { CreatePostButton } from "../CreatePostButton";
import { ProfileMenu } from "./ProfileMenu";
import { useState } from "react";

export const Navbar = (): JSX.Element => {
  const [dark, setDark] = useState(false);
  const toggleDarkMode = () => {
    setDark(!dark);
    if (dark) {
      document.getElementById("html")?.classList.remove("dark");
    } else {
      document.getElementById("html")?.classList.add("dark");
    }
  };
  return (
    <div className="w-full bg-container-light dark:bg-container-dark m-auto shadow-md sticky top-0 z-50">
      <div className="flex max-w-7xl m-auto px-3 h-14">
        <Logo />
        <div className="flex flex-row ml-auto">
          <CreatePostButton />
          <LogoutButton />
          <SignInButtons flex={FlexDirections.ROW} />
          <button
            className="text-default dark:text-white"
            onClick={toggleDarkMode}
          >
            {dark ? "Light mode" : "Dark mode"}
          </button>
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};
