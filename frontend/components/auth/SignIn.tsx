"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { axiosInstance } from "@/lib/axiosInstance";
import { SignInType } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AppLink from "../ui/AppLink";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInType>();

  const router = useRouter();

  const onSubmit = async ({ email, password }: SignInType) => {
    try {
      const resp = await axiosInstance.post("/auth/sign-in", {
        email,
        password,
      });
      if (resp.status === 201) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm flex flex-col items-center gap-5 p-4 rounded-md bg-white"
    >
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold">Sign In</h1>
        <AppLink href="/auth/sign-up">
          Sign Up
        </AppLink>
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="signin-email">Email:</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        {errors.email && <p className="text-red-600">Please enter email</p>}
      </div>

      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="signin-password">Password:</Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-red-600">Please enter password</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Sign In
      </Button>
    </form>
  );
}
