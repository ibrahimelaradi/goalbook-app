import app from "firebase/app";
import "firebase/firestore";

type Todo = {
  title: string;
  done: boolean;
};

export type Comment = {
  author: string;
  content: string;
};

export type Like = {
  author: string;
  liked: boolean;
};

export type Goal = {
  author: string;
  title: string;
  description: string;
  todos: Todo[];
  postedAt: app.firestore.Timestamp;
};

export type GoalWithLikes = Goal & {
  likes: Like[];
};

export type User = {
  displayName: string;
  displayPhoto?: string;
};
