import Post from "./Post";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getPostsServerSide } from "./getPosts";
import ProtectedWrapper from "@/components/ProtectedWrapper";
import PostForm from "./PostForm";

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

export default async function Posts() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const posts = await getPostsServerSide(token);

  return (
    <div className="w-full max-w-[1440px] px-4 py-12">
      <ProtectedWrapper>
        <PostForm />
        {posts.data.map((p: Post) => (
          <Post
            key={p._id}
            _id={p._id}
            author={p.author}
            title={p.title}
            content={p.content}
            createdAt={p.createdAt}
          />
        ))}
      </ProtectedWrapper>
    </div>
  );
}
