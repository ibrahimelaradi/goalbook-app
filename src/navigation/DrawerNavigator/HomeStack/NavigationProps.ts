import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "./ParamList";

export type AllGoalsNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "Home"
>;
export type GoalViewNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "Goal"
>;
export type PostGoalNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "PostGoal"
>;
export type EditGoalNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "EditGoal"
>;
