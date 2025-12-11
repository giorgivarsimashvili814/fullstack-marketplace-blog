"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  AddPostType,
  addPostSchema,
} from "../../../validation/add-post.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios-instance";
import { useRouter } from "next/navigation";

export default function PostForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddPostType>({
    resolver: yupResolver(addPostSchema),
  });
  const router = useRouter();

  const maxCharsContent = 300;
  const content = watch("content");
  const maxCharsTitle = 20;
  const title = watch("title");

  const onSubmit = async (data: AddPostType) => {
    try {
      const resp = await axiosInstance.post("/posts", data);

      if (resp.status === 201) {
        toast.success("Post added successfully");
        reset();
        router.refresh();
        return;
      }

      toast.error(resp.data.message);
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
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <CardTitle>Add a Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="title">Post Title</Label>
                <p className="text-sm text-gray-500">
                  {title?.length || 0}/{maxCharsTitle}
                </p>
              </div>
              <Input
                id="title"
                placeholder="Give your post a title"
                {...register("title")}
                maxLength={maxCharsTitle}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="content">Post Content</Label>
                <p className="text-sm text-gray-500">
                  {content?.length || 0}/{maxCharsContent}
                </p>
              </div>
              <Textarea
                id="content"
                placeholder="Start typing your story..."
                {...register("content")}
                maxLength={maxCharsContent}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-4">
          <Button type="submit" className="w-full">
            post
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
