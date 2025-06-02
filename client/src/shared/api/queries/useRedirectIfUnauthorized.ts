import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectIfUnauthorized = (
  isAuthenticated: boolean,
  hasError: boolean,
  redirectTo: string = "sign-in",
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && hasError) {
      navigate(redirectTo, { replace: true });
    }
  }, [hasError, isAuthenticated, navigate, redirectTo]);
};
