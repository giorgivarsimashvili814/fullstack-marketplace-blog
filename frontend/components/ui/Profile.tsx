import { User } from "@/lib/types";
import Link from "next/link";

type Props = {
  author: User;
};

export default function Profile({ author }: Props) {
  return (
    <Link href={`/users/${author._id}`} className="flex gap-2.5 items-center">
      <div className="h-10 w-10 rounded-full bg-black text-white font-bold flex justify-center items-center">
        {author.username[0].toUpperCase()}
      </div>
      <h2>{author.username}</h2>
    </Link>
  );
}
