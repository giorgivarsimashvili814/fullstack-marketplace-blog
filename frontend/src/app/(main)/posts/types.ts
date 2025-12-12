import { User } from "@/types";

export interface PostType {
  _id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
}