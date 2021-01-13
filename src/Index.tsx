import React, { ReactElement } from "react";
import { AppLoading, registerRootComponent } from "expo";
import firebase from "firebase";
import { App } from "./App";
import { DarkTheme, DefaultTheme } from "./theme";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import firebaseConfig from "~/configs/firebase.json";

firebase.initializeApp(firebaseConfig);

function Index(): ReactElement {
  console.log(firebase.apps.length);
  return (
    <PaperProvider theme={DefaultTheme}>
      <NavigationContainer theme={DefaultTheme}>
        {firebase.apps.length > 0 ? <App /> : <AppLoading />}
      </NavigationContainer>
    </PaperProvider>
  );
}

export default registerRootComponent(Index);
