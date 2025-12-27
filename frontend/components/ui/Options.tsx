"use client";

import { useState } from "react";
import Button from "./Button";
import { deletePost } from "@/lib/actions";
import { redirect, usePathname, useRouter } from "next/navigation";

type Props = {
  postId: string;
  setIsEditing: (value: boolean) => void;
};

export default function Options({ setIsEditing, postId }: Props) {
  const [options, setOptions] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function showOptions() {
    setOptions((prev) => !prev);
  }

  function handleEdit() {
    setOptions(false);

    if (pathname === "/posts") {
      router.push(`/posts/${postId}?edit=true`);
    } else {
      setIsEditing(true);
    }
  }

  return (
    <div className="relative">
      <Button onClick={showOptions}>⋮</Button>
      {options && (
        <div className="absolute right-0 top-10 w-30 bg-white p-2 rounded-md shadow flex flex-col">
          <Button onClick={handleEdit}>Edit</Button>
          <Button variant="destructive" onClick={() => deletePost(postId)}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
