import { useNavigate } from "react-router-dom";
import { signUpSchema, SignUpSchemaType } from "../zod/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@shared/api";
import toast from "react-hot-toast";

export const useSignUp = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, reset } = useForm<SignUpSchemaType>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(signUpSchema),
  });

  const { ...rest } = useMutation({
    mutationFn: (data: SignUpSchemaType) => onSubmit(data),
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    try {
      const response = await signUp(data);

      if (response?.status === 201) {
        toast.success("Registration is Success");
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

  return { ...rest, handleSubmit, control, reset };
};
