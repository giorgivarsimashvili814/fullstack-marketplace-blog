import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { editPost } from "@/lib/actions";
import { Post } from "@/lib/types";
import AppLink from "../ui/AppLink";

type Props = {
  post: Post;
};

export default function EditPostForm({ post }: Props) {
  return (
    <form
      action={editPost.bind(null, post?._id)}
      className="w-full max-w-sm flex flex-col items-center gap-5 p-4 rounded-md border-2 bg-white"
    >
      <div className="w-full flex justify-between">
        <h1 className="font-bold text-left">Edit Post</h1>
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="title">Title:</Label>
        <Input id="title" name="title" type="text" defaultValue={post?.title} />
      </div>
      <div className="w-full flex flex-col gap-1">
        <Label htmlFor="content">Content:</Label>
        <Textarea
          id="content"
          name="content"
          maxLength={180}
          rows={5}
          defaultValue={post?.content}
        />
      </div>

      <div className="w-full flex justify-end gap-5">
        <Button type="submit">Edit post</Button>
        <AppLink href="/posts" variant="destructive">
          Cancel
        </AppLink>
      </div>
    </form>
  );
}
