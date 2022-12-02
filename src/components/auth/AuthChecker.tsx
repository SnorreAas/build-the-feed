import React from "react";
import { useNavigate } from "react-router-dom";
import { useMount } from "../../hooks/useMount";
import { useUserContext } from "./UserContext";

interface Props {
  children: React.ReactNode;
}

export const AuthChecker = ({ children }: Props) => {
  const navigate = useNavigate();
  const user = useUserContext();

  useMount(() => {
    if (!user) {
      navigate("/");
    }
  });

  return <>{children}</>;
};
