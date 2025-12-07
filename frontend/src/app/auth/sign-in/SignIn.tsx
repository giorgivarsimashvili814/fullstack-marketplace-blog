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
import { signInSchema, SignInType } from "@/validation/sign-in.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { setCookie } from "cookies-next/client";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const { setAuthUser, setIsLoggedIn } = useAuth();

  const onSubmit = async ({ email, password }: SignInType) => {
    try {
      const resp = await axiosInstance.post("/auth/sign-in", {
        email,
        password,
      });
      if (resp.status === 201) {
        const token = resp.data.token;
        setCookie("token", token, { maxAge: 60 * 60 });

        const userRes = await axiosInstance.get("/auth/current-user");
        setAuthUser(userRes.data);
        setIsLoggedIn(true);

        toast.success("Logged in successfully");
        router.push("/");
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
          <CardTitle>Sign In</CardTitle>
          <CardAction>
            <Link href="/auth/sign-up">
              <Button variant="link">Sign Up</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Password"
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
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
