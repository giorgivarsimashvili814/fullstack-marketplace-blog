"use client";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Label from "../../ui/Label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axiosInstance";
import { SignUpType } from "@/lib/schemas";
import { toast } from "sonner";

export default function SignUp() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpType>();

  const onSubmit = async ({ username, email, password }: SignUpType) => {
    try {
      const resp = await axiosInstance.post("/auth/sign-up", {
        username,
        email,
        password,
      });
      if (resp.status === 201) {
        reset();
        toast("Signed Up Successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm flex flex-col items-center gap-5 p-4 rounded-md border-2 bg-white"
    >
      <div className="w-full flex justify-between">
        <h1 className="font-bold">Sign Up</h1>
        <Link href="/auth/sign-in" className="hover:underline">
          Sign In
        </Link>
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="username">Username:</Label>
        <Input
          id="username"
          type="text"
          placeholder="Username"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <p className="text-red-600">Please enter username</p>
        )}
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="signup-email">Email:</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        {errors.email && <p className="text-red-600">Please enter email</p>}
      </div>

      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="signup-password">Password:</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-red-600">Please enter password</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>
  );
}
