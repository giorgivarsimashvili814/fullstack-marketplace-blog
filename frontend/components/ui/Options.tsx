"use client";

import { useState } from "react";
import Button from "./Button";
import {
  deleteComment,
  deletePost,
  deleteReply,
  editComment,
  editPost,
  editReply,
} from "@/lib/actions";
import { Object, User } from "@/lib/types";
import Label from "./Label";
import Input from "./Input";
import Textarea from "./Textarea";

type Props = {
  object: Object;
  currentUser: User;
};

export default function Options({ object, currentUser }: Props) {
  const [optionsShown, setOptionsShown] = useState(false);
  const [formShown, setFormShown] = useState(false);
  const isAuthor = object.author._id === currentUser._id;

  if (!isAuthor) return null;

  const closeModal = () => setFormShown(false);

  return (
    <div className="relative inline-block">
      <Button
        className="w-10 rounded-full border flex items-center justify-center text-center"
        onClick={() => setOptionsShown((prev) => !prev)}
      >
        ...
      </Button>

      {optionsShown && (
        <div className="absolute right-0 mt-2 w-40 rounded border bg-white shadow z-10">
          <Button onClick={() => setFormShown((prev) => !prev)}>Edit</Button>

          {"title" in object && (
            <form action={deletePost.bind(null, object._id, currentUser._id)}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          )}

          {"post" in object && (
            <form
              action={deleteComment.bind(null, object._id, currentUser._id)}
            >
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          )}

          {"comment" in object && (
            <form action={deleteReply.bind(null, object._id, currentUser._id)}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          )}
        </div>
      )}
      {"title" in object && formShown && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
          <form
            action={editPost.bind(null, object.author._id, object._id)}
            className="w-full max-w-sm flex flex-col items-center gap-5 p-4 rounded-md bg-white"
          >
            <div className="w-full flex flex-col gap-1">
              <Label htmlFor="title">Title:</Label>
              <Input
                id="title"
                name="title"
                type="text"
                maxLength={30}
                defaultValue={object.title}
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <Label htmlFor="content">Content:</Label>
              <Textarea
                id="content"
                name="content"
                maxLength={180}
                rows={5}
                defaultValue={object.content}
              />
            </div>

            <div className="w-full flex justify-end gap-5">
              <Button type="submit">Save</Button>
              <Button onClick={closeModal} variant="destructive">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      {"post" in object && formShown && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
          <form
            action={editComment.bind(
              null,
              object.author._id,
              object.post._id,
              object._id
            )}
            className="w-full max-w-2xl flex items-start justify-between gap-5 p-4 rounded-md border-2 bg-white"
          >
            <Textarea
              className="flex-1"
              id="content"
              name="content"
              maxLength={180}
              required
              defaultValue={object.content}
            />
            <div className="flex gap-2.5">
              <Button type="submit">Save</Button>
              <Button onClick={closeModal} variant="destructive">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {"comment" in object && formShown && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
          <form
            action={editReply.bind(
              null,
              object.author._id,
              object.comment._id,
              object._id
            )}
            className="w-full max-w-2xl flex items-start justify-between gap-5 p-4 rounded-md border-2 bg-white"
          >
            <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
              {currentUser.username[0].toUpperCase()}
            </div>
            <Textarea
              className="flex-1"
              id="content"
              name="content"
              maxLength={180}
              required
              defaultValue={object.content}
            />
            <div className="flex gap-2.5">
              <Button type="submit">Save</Button>
              <Button onClick={closeModal} variant="destructive">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
