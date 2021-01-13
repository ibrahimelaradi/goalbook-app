import { Goal } from "~/types/firebase";

export type HomeStackParamList = {
  Home: undefined;
  Goal: { goalId: string; authorId: string };
  PostGoal: undefined;
  EditGoal: { goalId: string; goal: Omit<Goal, "postedAt"> };
};
