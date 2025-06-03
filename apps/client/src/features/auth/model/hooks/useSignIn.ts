import { useForm } from "react-hook-form";
import { signInSchema, SignInSchemaType } from "../zod/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@shared/api";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

export const useSignIn = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, reset } = useForm<SignInSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(signInSchema),
  });
  const { ...rest } = useMutation({
    mutationFn: (data: SignInSchemaType) => onSubmit(data),
  });
  const onSubmit = async (data: SignInSchemaType) => {
    try {
      const response = await signIn(data);
      if (response?.status === 201) {
        toast.success("Logged is successful");
      }
      reset();
      navigate("/", { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Something went wrong");
        throw new Error("Something went wrong");
      }
    }
  };

  return { handleSubmit, control, ...rest };
};
