"use client";
import { axiosInstance } from "@/lib/axios-instance";
import { AddPostType } from "./schema/add-post.schema";
import { PostType } from "./types";

export async function createPost(
  data: AddPostType
): Promise<PostType | undefined> {
  try {
    const resp = await axiosInstance.post("/posts", data);
    console.log("Post created successfully");
    return resp.data;
  } catch (error: unknown) {
    console.error("Failed to create post", error);
    return undefined;
  }
}

export async function editPost(
  postId: string,
  data: Partial<AddPostType>
): Promise<PostType | undefined> {
  try {
    const resp = await axiosInstance.patch(`/posts/${postId}`, data);
    console.log("Post updated successfully");
    return resp.data;
  } catch (error: unknown) {
    console.error("Failed to update post", error);
    return undefined;
  }
}

export async function deletePost(postId: string): Promise<boolean> {
  try {
    await axiosInstance.delete(`/posts/${postId}`);
    console.log("Post deleted successfully");
    return true;
  } catch (error: unknown) {
    console.error("Failed to delete post", error);
    return false;
  }
}
