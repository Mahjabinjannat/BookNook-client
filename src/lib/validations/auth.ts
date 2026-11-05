import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  email: z.email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
