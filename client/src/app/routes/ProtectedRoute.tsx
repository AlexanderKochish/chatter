import { ReactNode } from "react";
import { useProfile } from "../../shared/api/queries/useProfile";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { me } = useProfile();

  if (!me) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
