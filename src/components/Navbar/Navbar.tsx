import { Logo } from "../common/Logo";
import { FlexDirections, SignInButtons } from "../auth/SignInButtons";
import { LogoutButton } from "../auth/LogoutButton";
import { CreatePostButton } from "../CreatePostButton";

export const Navbar = (): JSX.Element => {
  return (
    <div className="w-full bg-white m-auto shadow-md sticky top-0 z-50">
      <div className="flex max-w-7xl m-auto px-3 h-14">
        <Logo />
        <div className="flex flex-row ml-auto">
          <CreatePostButton />
          <LogoutButton />
          <SignInButtons flex={FlexDirections.ROW} />
        </div>
      </div>
    </div>
  );
};
