import { StackNavigationProp } from "@react-navigation/stack";
import { LandingStackParamList } from "./ParamList";

export type LandingNavigationProps = StackNavigationProp<
  LandingStackParamList,
  "Landing"
>;

export type SigninNavigationProps = StackNavigationProp<
  LandingStackParamList,
  "Signin"
>;
