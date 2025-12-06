"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios-instance";
import { signUpSchema, SignUpType } from "@/validation/sign-up.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpType) => {
    try {
      const resp = await axiosInstance.post("/auth/sign-up", data);

      if (resp.status === 201) {
        toast.success("Registered successfully");
        router.push("/auth/sign-in");
      } else {
        toast.error(resp.data.message);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string | string[] }>;
      const message = err?.response?.data?.message;

      if (typeof message === "string") {
        toast.error(message);
      } else if (Array.isArray(message)) {
        toast.error(message.join(", "));
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardAction>
            <Link href="/auth/sign-in">
              <Button variant="link">sign In</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">username</Label>
                <Input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="username"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">password</Label>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-4">
            <Button type="submit" className="w-full">
              sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
