import React from "react";
import { useRouter } from "next/router";
import { useMount } from "../../../hooks/useMount";
import { useUserContext } from "../UserContext";

interface Props {
  children: React.ReactNode;
}

export default function AuthChecker({ children }: Props) {
  const router = useRouter();
  const user = useUserContext();

  useMount(() => {
    if (!user) {
      router.replace("/");
    }
  });

  return <>{children}</>;
}
