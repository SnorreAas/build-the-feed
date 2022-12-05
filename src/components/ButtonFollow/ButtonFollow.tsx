import { Button } from "../common/Button";
import { ButtonVariant } from "../common/Button/Button";
import { useEffect, useState } from "react";
import { database } from "../../service/firebase/FirebaseRealtimDB";

interface Props {
  userId: string | undefined;
  checkId: string | undefined;
  handleEvent?: (payload: string | undefined) => React.SetStateAction<string>;
}

export const ButtonFollow = ({ userId, checkId, handleEvent }: Props) => {
  const [userHasFollowed, setUserHasFollowed] = useState(false);
  const [dataUpdating, setDataUpdating] = useState(false);

  const registerFollow = async () => {
    if (userId && checkId) {
      setDataUpdating(true);
      await database
        .registerFollowOrUnFollow(userId, checkId)
        .then(() => setDataUpdating(false));
      if (handleEvent) {
        await database
          .getUserFollowerCount(checkId)
          .then((result) => handleEvent(result));
      }
    }
  };

  useEffect(() => {
    if (userId && checkId) {
      database
        .checkIfUserHasFollowed(userId, checkId)
        .then((result) => setUserHasFollowed(result));
    }
  }, [userId, checkId, dataUpdating]);

  return (
    <Button
      onClick={() => registerFollow()}
      text={userHasFollowed ? "Following" : "Follow"}
      variant={userHasFollowed ? ButtonVariant.OUTLINED : ButtonVariant.FILLED}
    />
  );
};
