import React, { ReactElement } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LandingStackParamList } from "./ParamList";
import { LandingScreen, SigninScreen } from "~/screens";
import { CustomNavigationBar } from "~/components/CustomNavigationBar";

const Stack = createStackNavigator<LandingStackParamList>();

export function LandingStackNavigator(): ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        header: CustomNavigationBar,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Signin" component={SigninScreen} />
    </Stack.Navigator>
  );
}
