"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CommentForm, PostForm, TargetType } from "./types";

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

export async function getCurrentUser() {
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

export async function getPosts() {
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
    next: { tags: ["posts"], revalidate: 60 },
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await resp.json();
  const posts = data.data;
  return posts;
}

export async function getPost(postId: string) {
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
      next: { tags: [`post-${postId}`] },
    }
  );

  if (!resp.ok) {
    return null;
  }

  const data = await resp.json();
  const post = data.data;
  return post;
}

export async function getPostsByAuthor(authorId: string) {
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
      next: { tags: [`posts-by-${authorId}`] },
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await resp.json();
  const posts = data.data;
  return posts;
}

export async function deletePost(postId: string, authorId: string) {
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
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to delete post");
  }

  revalidateTag("posts", { expire: 0 });
  revalidateTag(`posts-by-${authorId}`, { expire: 0 });
  revalidateTag(`post-${postId}`, { expire: 0 });
  redirect("/posts");
}

export async function createPost(authorId: string, formData: FormData) {
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
    throw new Error("Failed to create post");
  }

  revalidateTag("posts", { expire: 0 });

  revalidateTag(`posts-by-${authorId}`, { expire: 0 });
  redirect("/posts");
}

export async function editPost(
  authorId: string,
  postId: string,
  formData: FormData
) {
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

  revalidateTag(`post-${postId}`, { expire: 0 });
  revalidateTag("posts", { expire: 0 });
  revalidateTag(`posts-by-${authorId}`, { expire: 0 });
  redirect("/posts");
}

export async function getComment(commentId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${commentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      next: { tags: [`comment-${commentId}`] },
    }
  );

  if (!resp.ok) {
    return null;
  }

  const data = await resp.json();
  const comment = data.data;
  return comment;
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

  revalidateTag(`post-${postId}`, { expire: 0 });
  revalidateTag(`comments-by-${postId}`, { expire: 0 });
}

export async function deleteComment(commentId: string, postId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: `token=${token}`,
      },
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to delete comment");
  }

  revalidateTag(`post-${postId}`, { expire: 0 });
  revalidateTag(`comments-by-${postId}`, { expire: 0 });
}

export async function editComment(
  authorId: string,
  postId: string,
  commentId: string,
  formData: FormData
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const contentValue = formData.get("content");

  const body: CommentForm = {};
  if (typeof contentValue === "string" && contentValue.trim() !== "") {
    body.content = contentValue;
  }

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${commentId}`,
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

  revalidateTag(`post-${postId}`, { expire: 0 });
  revalidateTag(`comment-${commentId}`, { expire: 0 });
  revalidateTag("posts", { expire: 0 });
  revalidateTag(`posts-by-${authorId}`, { expire: 0 });
  redirect(`/posts/${postId}`);
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
      next: { tags: [`comments-by-${postId}`] },
    }
  );

  if (!resp.ok) {
    return [];
  }

  const data = await resp.json();
  const comments = data.data;
  return comments;
}

export async function toggleLike(
  targetType: TargetType,
  authorId: string,
  targetId: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Not authenticated");

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/likes/${targetType}/${targetId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
    }
  );

  if (!resp.ok) throw new Error("Failed to toggle like");

  revalidateTag(`likes-by-${targetType}-${targetId}`, { expire: 0 });
  revalidateTag(`posts-by-${authorId}`, { expire: 0 });
  revalidateTag("posts", { expire: 0 });
}

export async function getLikes(targetType: TargetType, targetId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Not authenticated");

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/likes/${targetType}/${targetId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      next: { tags: [`likes-by-${targetType}-${targetId}`] },
    }
  );

  if (!resp.ok) throw new Error("Failed to fetch likes");

  const data = await resp.json();
  return data.data;
}
