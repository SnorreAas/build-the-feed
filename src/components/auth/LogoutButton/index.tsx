import { useRouter } from "next/router";
import { Paths } from "../../../old-react/routes/routes";
import { Button } from "../../common/Button";
import { ButtonVariant } from "../../common/Button/Button";
import { auth } from "../../../service/firebase/FirebaseAuth";
import { useUserContext } from "../UserContext";

interface Props {
  navigateTo?: string;
}

export default function LogoutButton({ navigateTo = Paths.HOME }: Props) {
  const router = useRouter();
  const user = useUserContext();

  const logout = () => {
    auth.signOut().then(() => {
      router.replace(navigateTo);
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Button text="Log out" variant={ButtonVariant.FLAT} onClick={logout} />
  );
}
