import { RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "./ParamList";

export type AllGoalsRouteProp = RouteProp<HomeStackParamList, "Home">;
export type GoalViewRouteProp = RouteProp<HomeStackParamList, "Goal">;
export type PostGoalRouteProp = RouteProp<HomeStackParamList, "PostGoal">;
export type EditGoalRouteProp = RouteProp<HomeStackParamList, "EditGoal">;
