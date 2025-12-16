"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Post, PostForm, User } from "./types";

export async function signUp(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/sign-up`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    }
  );

  if (resp.status === 201) redirect("/auth/sign-in");

  throw new Error("Sign up failed");
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/current-user`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to fetch current user");
  }

  return resp.json();
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { path: "/", maxAge: 0 });
  revalidatePath("/");
}

export async function getPosts(): Promise<Post[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await resp.json();
  const posts = data.data;
  return posts;
}

export async function getPost(postId: string): Promise<Post> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await resp.json();
  const post = data.data;
  return post;
}

export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/author/${authorId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await resp.json();
  const posts = data.data;
  return posts;
}

export async function deletePost(
  postId: string,
  _formData?: FormData
): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: `token=${token}`,
      },
      cache: "no-store",
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to delete post");
  }

  revalidatePath("/posts");
}

export async function createPost(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },

    body: JSON.stringify({ title, content }),
  });

  if (!resp.ok) {
    throw new Error("Failed to delete post");
  }

  redirect("/posts");
}

export async function editPost(postId: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const titleValue = formData.get("title");
  const contentValue = formData.get("content");

  const body: PostForm = {};
  if (typeof titleValue === "string" && titleValue.trim() !== "") {
    body.title = titleValue;
  }
  if (typeof contentValue === "string" && contentValue.trim() !== "") {
    body.content = contentValue;
  }

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to edit post");
  }

  redirect("/posts");
}

export async function createComment(postId: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const content = formData.get("content") as string;

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/comments/post/${postId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },

      body: JSON.stringify({ content }),
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to create comment");
  }

  revalidatePath("/posts");
}

export async function getCommentsByPost(postId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/comments/post/${postId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data = await resp.json();
  const comments = data.data;
  return comments;
}
