"use client";
import { axiosInstance } from "@/lib/axios-instance";
import { useEffect, useState } from "react";
import Post from "./Post";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: AuthUser;
  createdAt: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);

  const { authUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        console.log(res.data.data);
        setPosts(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  if (!authUser) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-[1440px] px-4 py-12">
      {posts.map((p) => (
        <Post
          key={p._id}
          _id={p._id}
          author={p.author}
          title={p.title}
          content={p.content}
          createdAt={p.createdAt}
        />
      ))}
    </div>
  );
}
