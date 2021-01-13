import React, { ReactElement } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AccountStackParamList } from "./ParamList";
import {
  AccountScreen,
  EditAccountScreen,
  PersonalGoalsScreen,
} from "~/screens";
import { CustomNavigationBar } from "../../../components/CustomNavigationBar";
import { DrawerNavigatorNavigationProps } from "~/navigation";

const Stack = createStackNavigator<AccountStackParamList>();

interface Props {
  navigation: DrawerNavigatorNavigationProps.AccountDrawerNavigationProp;
}

export function AccountStackNavigator(props: Props): ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{
        header: (hprops) => (
          <CustomNavigationBar
            {...hprops}
            toggleDrawer={props.navigation.toggleDrawer}
          />
        ),
      }}
    >
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{ title: "Edit Account" }}
      />
      <Stack.Screen
        name="PersonalGoals"
        component={PersonalGoalsScreen}
        options={{ title: "Personal Goals" }}
      />
    </Stack.Navigator>
  );
}
