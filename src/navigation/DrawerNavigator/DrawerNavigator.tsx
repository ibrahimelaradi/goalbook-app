import React, { ReactElement } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CustomDrawer } from "~/components/CustomDrawer";
import { DrawerNavigatorParamList } from "./ParamList";
import { HomeStackNavigator } from "./HomeStack/HomeStackNavigator";
import { AccountStackNavigator } from "./AccountStack/AccountStackNavigator";

const Drawer = createDrawerNavigator<DrawerNavigatorParamList>();

export function DrawerNavigator(): ReactElement {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeStackNavigator} />
      <Drawer.Screen name="Account" component={AccountStackNavigator} />
    </Drawer.Navigator>
  );
}
