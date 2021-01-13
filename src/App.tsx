import React, { ReactElement } from "react";
import { AppLoading } from "expo";
import app from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { DrawerNavigator, LandingStackNavigator } from "./navigation";
import { ErrorScreen } from "./screens";
import { LogBox } from "react-native";

// Remove annoying timer warning:

LogBox.ignoreLogs(["Setting a timer"]);

export function App(): ReactElement {
  // * Get authentication state from Firebase
  const [user, loading, error] = useAuthState(app.auth());
  return loading ? (
    // * Display splash screen until auth state is loaded
    <AppLoading />
  ) : error ? (
    // * Display the error screen on failure
    <ErrorScreen />
  ) : user ? (
    // * Display the drawer navigator if the user is logged in
    <DrawerNavigator />
  ) : (
    // * Display the landing navigator if the user is not logged in
    <LandingStackNavigator />
  );
}
