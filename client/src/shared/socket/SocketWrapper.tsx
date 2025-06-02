import { ReactNode, useEffect } from "react";
import { SocketProvider } from "./provider";
import { useProfile } from "../api/queries/useProfile";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner/Spinner";

type Props = {
  children: ReactNode;
};

export const SocketWrapper = ({ children }: Props) => {
  const { me, isLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !me?.id) {
      navigate("/sign-in");
    }
  }, [navigate, isLoading, me?.id]);

  if (isLoading) {
    return <Spinner />;
  }

  return <SocketProvider userId={me?.id}>{children}</SocketProvider>;
};
