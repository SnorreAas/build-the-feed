import { useNavigate } from "react-router-dom";
import { Paths } from "../../routes/routes";
import { auth } from "../../service/firebase/FirebaseAuth";
import { Button, ButtonVariant } from "../common/Button/Button";
import { useUserContext } from "./UserContext";

export enum FlexDirections {
  ROW = "row",
  COLUMN = "column",
}

interface Props {
  flex: FlexDirections;
}

export const SignInButtons = ({ flex }: Props) => {
  const navigate = useNavigate();
  const user = useUserContext();

  const signIn = () => {
    auth.signInWithGoogle().then(() => {
      navigate(Paths.HOME);
    });
  };

  if (user) {
    return null;
  }

  return (
    <div
      className={
        flex === FlexDirections.ROW
          ? "flex flex-row ml-auto my-auto"
          : "flex flex-col-reverse mx-auto"
      }
    >
      <div className={flex === FlexDirections.ROW ? "mr-2" : "text-center"}>
        <Button onClick={signIn} text="Log in" variant={ButtonVariant.FLAT} />
      </div>
      <div className={flex === FlexDirections.ROW ? "mr-2" : "mb-2"}>
        <Button
          onClick={signIn}
          text="Create account"
          variant={ButtonVariant.OUTLINED}
          route="login"
        />
      </div>
    </div>
  );
};
