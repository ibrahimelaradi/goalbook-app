import React, { FunctionComponent } from "react";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { useTheme, Avatar, Title, Subheading } from "react-native-paper";
import {
  DrawerItemList,
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { ScrollView } from "react-native-gesture-handler";
import app from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Ionicons } from "@expo/vector-icons";

export const CustomDrawer: FunctionComponent<DrawerContentComponentProps> = (
  props: DrawerContentComponentProps
) => {
  const { colors } = useTheme();
  const [user] = useAuthState(app.auth());

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: Dimensions.get("window").width / 2.1,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    headerContent: {
      flex: 1,
      flexDirection: "row",
      alignSelf: "flex-start",
      alignItems: "center",
      marginLeft: 20,
    },
    shiftTop: {
      height: getStatusBarHeight(),
      width: "100%",
    },
    item: {
      width: "100%",
      marginLeft: 0,
      marginVertical: 0,
      borderRadius: 0,
    },
    itemLabel: {
      fontSize: 18,
      padding: 8,
    },
    signoutButton: {
      marginLeft: 10,
    },
    signoutLabel: {
      fontSize: 18,
      color: "tomato",
      padding: 8,
    },
    name: {
      fontWeight: "bold",
    },
    welcomeMessage: {
      padding: 8,
      paddingLeft: 18,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.shiftTop} />
        <View style={styles.headerContent}>
          <Avatar.Image
            accessibilityComponentType="img"
            accessibilityTraits="img"
            size={Dimensions.get("window").width / 4.2}
            source={{
              uri:
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${user?.displayName}`,
            }}
          />
          <View style={styles.welcomeMessage}>
            <Subheading>Welcome,</Subheading>
            <Title style={styles.name}>{user?.displayName}</Title>
          </View>
        </View>
      </View>
      <ScrollView>
        <DrawerItemList
          {...props}
          itemStyle={styles.item}
          labelStyle={styles.itemLabel}
          activeTintColor={colors.surface}
          activeBackgroundColor={colors.primary}
        />
      </ScrollView>
      <View>
        <DrawerItem
          icon={(props) => (
            <Ionicons
              name={Platform.OS === "ios" ? "ios-exit" : "md-exit"}
              size={props.size}
              color="tomato"
            />
          )}
          style={styles.signoutButton}
          labelStyle={styles.signoutLabel}
          label="Sign out"
          onPress={() => app.auth().signOut()}
        />
      </View>
    </View>
  );
};
