export type User = {
  _id: string;
  username: string;
  email: string;
};

export type Post = {
  _id: string;
  title: string;
  content: string;
  author: User;
};

export type Comment = {
  _id: string;
  content: string;
  post: Post;
  author: User;
};

export type Like = {
  _id: string;
  target: string;
  author: string;
  targetType: "post" | "comment" | "reply";
};

export type PostForm = {
  title?: string;
  content?: string;
};
