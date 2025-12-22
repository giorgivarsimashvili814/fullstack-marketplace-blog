import { Comment } from "@/lib/types";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { createReply, getCurrentUser } from "@/lib/actions";
import AppLink from "../ui/AppLink";

type Props = {
  comment: Comment;
};

export default async function CreateReplyForm({ comment }: Props) {
  const currentUser = await getCurrentUser();
  return (
    <form
      action={createReply.bind(null, comment._id, comment.author._id)}
      className="w-full max-w-2xl flex items-start justify-between gap-5 p-4 rounded-md border-2 bg-white"
    >
      <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
        {currentUser?.username[0].toUpperCase()}
      </div>
      <Textarea
        className="flex-1"
        id="content"
        name="content"
        maxLength={120}
        required
      />
      <div className="flex gap-2.5">
        <Button type="submit">Add</Button>
        <AppLink href={`/posts/${comment.post._id}`} variant="destructive">
          Cancel
        </AppLink>
      </div>
    </form>
  );
}
