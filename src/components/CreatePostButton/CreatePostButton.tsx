import { Paths } from "../../old-react/routes/routes";
import { useUserContext } from "../auth/UserContext";
import { Button } from "../common/Button";
import { ButtonVariant } from "../common/Button/Button";

interface Props {
  navigateTo?: string;
}

export const CreatePostButton = ({ navigateTo = Paths.NEW }: Props) => {
  const user = useUserContext();

  if (!user) {
    return null;
  }

  return (
    <Button
      text="Create Post"
      variant={ButtonVariant.OUTLINED}
      route={navigateTo}
    />
  );
};
