import React from "react";
import {
  Appbar,
  // Menu
} from "react-native-paper";
import { StackHeaderProps, StackNavigationProp } from "@react-navigation/stack";
import { CompositeNavigationProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";

interface CustomBarProps extends StackHeaderProps {
  toggleDrawer?(): void;
}
// ! Experimental
export function CustomNavigationBar({
  navigation,
  previous,
  scene,
  toggleDrawer,
}: CustomBarProps) {
  // const [visible, setVisible] = React.useState(false);
  // const openMenu = () => setVisible(true);
  // const closeMenu = () => setVisible(false);
  return (
    <Appbar.Header
      accessibilityComponentType="button"
      accessibilityTraits="button"
    >
      {previous ? (
        <Appbar.BackAction
          accessibilityComponentType="button"
          accessibilityTraits="button"
          onPress={navigation.goBack}
        />
      ) : null}
      {toggleDrawer ? (
        <Appbar.Action
          accessibilityComponentType="button"
          accessibilityTraits="button"
          icon="menu"
          onPress={toggleDrawer}
        />
      ) : null}
      <Appbar.Content
        accessibilityComponentType="button"
        accessibilityTraits="button"
        title={scene.descriptor.options.title || scene.route.name}
      />
      {/* {!previous ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              accessibilityComponentType="button"
              accessibilityTraits="button"
              icon="menu"
              color="white"
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              console.log("Option 1 was pressed");
            }}
            title="Option 1"
          />
          <Menu.Item
            onPress={() => {
              console.log("Option 2 was pressed");
            }}
            title="Option 2"
          />
          <Menu.Item
            onPress={() => {
              console.log("Option 3 was pressed");
            }}
            title="Option 3"
            disabled
          />
        </Menu>
      ) : null} */}
    </Appbar.Header>
  );
}
