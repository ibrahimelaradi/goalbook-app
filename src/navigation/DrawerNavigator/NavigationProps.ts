import { CompositeNavigationProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerNavigatorParamList } from "./ParamList";
import * as HomeStackNavigationProps from "./HomeStack/NavigationProps";
import * as AccountStackNavigationProps from "./AccountStack/NavigationProps";

// Home:

export type GoalsDrawerNavigationProp = DrawerNavigationProp<
  DrawerNavigatorParamList,
  "Home"
>;

export type GoalsToAllGoalsNavigationProps = CompositeNavigationProp<
  HomeStackNavigationProps.AllGoalsNavigationProps,
  GoalsDrawerNavigationProp
>;
export type GoalsToGoalViewNavigationProps = CompositeNavigationProp<
  HomeStackNavigationProps.GoalViewNavigationProps,
  GoalsDrawerNavigationProp
>;
export type GoalsToPostGoalNavigationProps = CompositeNavigationProp<
  HomeStackNavigationProps.PostGoalNavigationProps,
  GoalsDrawerNavigationProp
>;
export type GoalsToEditGoalNavigationProps = CompositeNavigationProp<
  HomeStackNavigationProps.EditGoalNavigationProps,
  GoalsDrawerNavigationProp
>;

// Account:

export type AccountDrawerNavigationProp = DrawerNavigationProp<
  DrawerNavigatorParamList,
  "Account"
>;

export type AccountToEditAccountNavigationProps = CompositeNavigationProp<
  AccountStackNavigationProps.EditAccountNavigationProps,
  AccountDrawerNavigationProp
>;
export type AccountToPersonalGoalsNavigationProps = CompositeNavigationProp<
  AccountStackNavigationProps.PersonalGoalsNavigationProps,
  AccountDrawerNavigationProp
>;

// type AccountDrawerNavigationProp = DrawerNavigationProp<DrawerNavigatorParamList, "Account">
// export type AccountToAccountNavigationProp = CompositeNavigationProp<

// >
