import { StackNavigationProp } from "@react-navigation/stack";
import { AccountStackParamList } from "./ParamList";

export type AccountStackNavigationProps = StackNavigationProp<
  AccountStackParamList,
  "Account"
>;

export type EditAccountNavigationProps = StackNavigationProp<
  AccountStackParamList,
  "EditAccount"
>;

export type PersonalGoalsNavigationProps = StackNavigationProp<
  AccountStackParamList,
  "PersonalGoals"
>;
