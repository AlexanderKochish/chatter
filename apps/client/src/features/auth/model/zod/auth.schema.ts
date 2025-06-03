import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(3).max(20),
    email: z.string().trim().email({ message: "Invalid email" }),
    password: z.string().trim().min(4).max(20),
    confirmPassword: z.string().trim(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword && data.confirmPassword.length > 0,
    {
      message: "Invalid confirm password",
      path: ["confirmPassword"],
    },
  );

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }),
  password: z.string().trim().min(4).max(20),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
