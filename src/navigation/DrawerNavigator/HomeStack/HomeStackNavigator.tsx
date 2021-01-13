import React, { ReactElement } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeStackParamList } from "./ParamList";
import {
  EditGoalScreen,
  GoalDetailsScreen,
  HomeScreen,
  PostGoalScreen,
} from "~/screens";
import { CustomNavigationBar } from "../../../components/CustomNavigationBar";
import { DrawerNavigatorNavigationProps } from "~/navigation";

const Stack = createStackNavigator<HomeStackParamList>();

interface Props {
  navigation: DrawerNavigatorNavigationProps.GoalsDrawerNavigationProp;
}

export function HomeStackNavigator(props: Props): ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: (hprops) => (
          <CustomNavigationBar
            {...hprops}
            toggleDrawer={props.navigation.toggleDrawer}
          />
        ),
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="PostGoal"
        component={PostGoalScreen}
        options={{ title: "New Goal" }}
      />
      <Stack.Screen
        name="EditGoal"
        component={EditGoalScreen}
        options={{ title: "Edit Goal" }}
      />
      <Stack.Screen
        name="Goal"
        component={GoalDetailsScreen}
        options={{ title: "Goal Details" }}
      />
    </Stack.Navigator>
  );
}
