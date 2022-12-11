import { User } from "firebase/auth";
import { useState } from "react";
import { useMount } from "../../../hooks/useMount";
import { auth } from "../../../service/firebase/FirebaseAuth";
import { UserContext } from "../UserContext";

interface Props {
  children: React.ReactNode;
}

export default function UserProvider({ children }: Props) {
  const [user, setuser] = useState<User | null>(null);

  useMount(() => {
    function updateAuthState(user: User | null) {
      setuser(user);
    }

    auth.subscribe(updateAuthState);
    return () => {
      auth.unsubscribe(updateAuthState);
    };
  });
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
