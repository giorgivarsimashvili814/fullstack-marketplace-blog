"use client";
import { Post } from "@/lib/types";
import Options from "../ui/Options";
import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  post: Post;
};

export default function ClientPost({ post }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const editParam = params.get("edit") === "true";
  const [isEditing, setIsEditing] = useState(editParam);
  const [titleValue, setTitleValue] = useState(post.title);
  const [contentValue, setContentValue] = useState(post.content);

  useEffect(() => {
    if (editParam) {
      router.replace(window.location.pathname);
    }
  }, [editParam, router]);

  const editPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${post._id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          title: titleValue,
          content: contentValue,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (resp.ok) setIsEditing(false);
  };

  return (
    <>
      {/* card header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2.5 items-center">
          <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
            {post.author.username[0].toUpperCase()}
          </div>
          <h2>{post.author.username}</h2>
        </div>
        {!isEditing && (
          <Options setIsEditing={setIsEditing} postId={post._id} />
        )}
      </div>
      {/* card main */}
      {isEditing ? (
        <form className="flex flex-col gap-2.5" onSubmit={editPost}>
          <Input
            maxLength={50}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
          />
          <Textarea
            maxLength={180}
            rows={3}
            value={contentValue}
            onChange={(e) => setContentValue(e.target.value)}
          />
          <div className="grid grid-cols-2 w-fit self-end">
            <Button variant="destructive" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      ) : (
        <article className="flex flex-col gap-2.5">
          <h3 className="text-2xl overflow-wrap wrap-break-word">
            {titleValue}
          </h3>
          <p className="overflow-wrap wrap-break-word">{contentValue}</p>
        </article>
      )}
    </>
  );
}
