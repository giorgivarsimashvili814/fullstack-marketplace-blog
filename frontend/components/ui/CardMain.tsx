import { Object } from "@/lib/types";
import Link from "next/link";

type Props = {
  object: Object;
};

export default function CardMain({ object }: Props) {
  if ("title" in object)
    return (
      <Link href={`/posts/${object._id}`}>
        <div className="flex flex-col gap-2.5 cursor-pointer min-h-37.5">
          <h3 className="text-2xl overflow-wrap wrap-break-word">
            {object.title}
          </h3>
          <p className="overflow-wrap wrap-break-word">{object.content}</p>
        </div>
      </Link>
    );

  return (
    <div className="flex flex-col gap-2.5 cursor-pointer min-h-37.5">
      <p className="overflow-wrap wrap-break-word">{object.content}</p>
    </div>
  );
}
