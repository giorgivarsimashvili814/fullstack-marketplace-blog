import { Post } from "@/lib/types";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { createComment, getCurrentUser } from "@/lib/actions";
import AppLink from "../ui/AppLink";

type Props = {
  post: Post;
};

export default async function CreateCommentForm({ post }: Props) {
  const currentUser = await getCurrentUser();
  return (
    <form
      action={createComment.bind(null, post?._id)}
      className="w-full max-w-2xl flex items-start justify-between gap-5 p-4 rounded-md border-2 bg-white"
    >
      <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
        {currentUser?.username[0].toUpperCase()}
      </div>
      <Textarea
        className="flex-1"
        id="content"
        name="content"
        maxLength={180}
        required
      />
      <div className="flex flex-col items-end gap-5">
        <Button type="submit">Add Comment</Button>
        <AppLink href="/posts" variant="destructive">
          Cancel
        </AppLink>
      </div>
    </form>
  );
}
