import { axiosInstance } from "@/lib/axios-instance";
import { PostType } from "./types";
import { User } from "@/types";
import { cookies } from "next/headers";

export async function getPosts(): Promise<PostType[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const resp = await axiosInstance.get("/posts", {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    return resp.data.data;
  } catch (error: unknown) {
    console.error("Failed to get posts", error);
    return [];
  }
}

export async function getPostById(
  postId: string
): Promise<PostType | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const resp = await axiosInstance.get(`/posts/${postId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    return resp.data;
  } catch (error: unknown) {
    console.error("Failed to get post", error);
    return undefined;
  }
}

export async function getPostByAuthor(
  authorId: string
): Promise<PostType[] | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const resp = await axiosInstance.get(`/posts/author/${authorId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    return resp.data;
  } catch (error: unknown) {
    console.error("Failed to get posts", error);
    return [];
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const resp = await axiosInstance.get("/auth/current-user", {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    return resp.data;
  } catch (error) {
    console.error("Failed to get current user", error);
    return null;
  }
}
