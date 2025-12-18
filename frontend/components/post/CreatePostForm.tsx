import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { createPost } from "@/lib/actions";
import AppLink from "../ui/AppLink";

export default function CreatePostForm() {
  return (
    <form
      action={createPost}
      className="w-full max-w-sm flex flex-col items-center gap-5 p-4 rounded-md border-2 bg-white"
    >
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-left">Create Post</h1>
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="title">Title:</Label>
        <Input id="title" name="title" type="text" required />
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="content">Content:</Label>
        <Textarea
          id="content"
          name="content"
          maxLength={180}
          rows={5}
          required
        />
      </div>

      <div className="w-full flex justify-end gap-5">
        <Button type="submit">Add post</Button>
        <AppLink href="/posts" variant="destructive">
          Cancel
        </AppLink>
      </div>
    </form>
  );
}
