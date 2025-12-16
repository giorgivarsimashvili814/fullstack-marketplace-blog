export type User = {
  _id: string;
  username: string;
  email: string;
};

export type Post = {
  _id: string
  title: string;
  content: string;
  author: User
};

export type Comment = {
  _id: string
  content: string;
  post: Post;
  author: User
};

export type PostForm = {
  title?: string;
  content?: string;
};
