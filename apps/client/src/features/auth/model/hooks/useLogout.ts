import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "@shared/api";

export const useLogout = () => {
  const navigate = useNavigate();
  const { ...rest } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/sign-in", { replace: true });
      window.location.replace("/sign-in");
    },
  });

  return { ...rest };
};
