import { InferType, object, string } from "yup";

export const signUpSchema = object({
  email: string().email().required("email is required"),
  password: string().min(6).max(20).required("password is required"),
  username: string().required("username is required"),
});

export type SignUpType = InferType<typeof signUpSchema>;


export const signInSchema = object({
  email: string().email().required("email is required"),
  password: string().min(6).max(20).required("password is required"),
});

export type SignInType = InferType<typeof signInSchema>;
