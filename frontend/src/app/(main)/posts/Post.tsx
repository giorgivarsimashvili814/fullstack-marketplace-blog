import Link from "next/link";

interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: AuthUser;
  createdAt: string;
}

export default function Post({ _id, author, title, content, createdAt }: Post) {
  function timeAgo(dateString: string) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  console.log(createdAt);
  return (
    <Link href={`posts/${_id}`}>
      <div className="max-w-2xl border rounded-lg p-4 flex flex-col gap-2.5">
        <div className="flex gap-2.5 items-center">
          <div className="h-10 w-10 rounded-full bg-black"></div>
          <h1>
            <strong>{author.username}</strong>
            <p>{timeAgo(createdAt)}</p>
          </h1>
        </div>
        <article className="flex flex-col gap-2.5">
          <h1 className="text-2xl">{title}</h1>
          <p>{content}</p>
        </article>
      </div>
    </Link>
  );
}
