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

export type Reply = {
  _id: string;
  content: string;
  comment: Comment;
  author: User;
};

export type Like = {
  _id: string;
  target: string;
  author: User;
  targetType: TargetType;
};

export type Object = Post | Comment | Reply;

export type TargetType = "post" | "comment" | "reply";

export type PostForm = {
  title?: string;
  content?: string;
};

export type CommentForm = {
  content?: string;
};
