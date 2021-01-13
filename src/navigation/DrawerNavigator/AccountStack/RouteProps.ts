import { RouteProp } from "@react-navigation/native";
import { AccountStackParamList } from "./ParamList";

export type AccountRouteProp = RouteProp<AccountStackParamList, "Account">;
export type EditAccountRouteProp = RouteProp<
  AccountStackParamList,
  "EditAccount"
>;
export type PersonalGoalsRouteProp = RouteProp<
  AccountStackParamList,
  "PersonalGoals"
>;
