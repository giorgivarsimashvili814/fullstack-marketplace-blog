import { Comment } from "@/lib/types";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { editComment, getCurrentUser } from "@/lib/actions";
import AppLink from "../ui/AppLink";

type Props = {
  comment: Comment;
  authorId: string;
};

export default async function EditCommentForm({ comment, authorId }: Props) {
  const currentUser = await getCurrentUser();
  return (
    <form
      action={editComment.bind(null, authorId, comment.post._id, comment._id)}
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
        defaultValue={comment?.content}
      />
      <div className="flex gap-2.5">
        <Button type="submit">Edit</Button>
        <AppLink href="/posts" variant="destructive">
          Cancel
        </AppLink>
      </div>
    </form>
  );
}
