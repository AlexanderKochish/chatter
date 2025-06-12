import { useNavigate } from "react-router-dom";
import { signUpSchema, SignUpSchemaType } from "../zod/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useSignUpMutation } from "../../api/auth.api";

export const useSignUp = () => {
  const navigate = useNavigate();
  const [ signUp, ...rest] = useSignUpMutation()

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

  const onSubmit = async (data: SignUpSchemaType) => {
    try {
      await signUp(data);
      toast.success("Registration is Success");

      reset();
      navigate("/", { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
    }
  };

  return { ...rest, handleSubmit: handleSubmit(onSubmit), control, reset };
};
