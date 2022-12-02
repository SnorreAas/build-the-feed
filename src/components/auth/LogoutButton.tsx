import { useNavigate } from "react-router-dom";
import { Paths } from "../../routes/routes";
import { Button } from "../common/Button";
import { ButtonVariant } from "../common/Button/Button";
import { auth } from "../../service/firebase/FirebaseAuth";
import { useUserContext } from "./UserContext";

interface Props {
  navigateTo?: string;
}

export const LogoutButton = ({ navigateTo = Paths.HOME }: Props) => {
  const navigate = useNavigate();
  const user = useUserContext();

  const logout = () => {
    auth.signOut().then(() => {
      navigate(navigateTo);
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Button text="Log out" variant={ButtonVariant.FLAT} onClick={logout} />
  );
};
