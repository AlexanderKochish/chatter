import { ReactNode, useEffect } from "react";
import { SocketProvider } from "./provider";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner/Spinner";
import { useGetCurrentUserQuery } from "@/features/auth/api/auth.api";

type Props = {
  children: ReactNode;
};

export const SocketWrapper = ({ children }: Props) => {
  const { data, isLoading } = useGetCurrentUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !data?.id) {
      navigate("/sign-in");
    }
  }, [navigate, isLoading, data?.id]);

  if (isLoading) {
    return <Spinner />;
  }

  return <SocketProvider userId={String(data?.id)}>{children}</SocketProvider>;
};
