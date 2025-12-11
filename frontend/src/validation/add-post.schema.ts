import { InferType, object, string } from "yup";

export const addPostSchema = object({
  title: string().max(20).required("title is required"),
  content: string().max(300).required("content is required"),
});

export type AddPostType = InferType<typeof addPostSchema>;