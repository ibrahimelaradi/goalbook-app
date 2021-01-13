import React, { ReactElement } from "react";
import { View, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 16,
  },
});

export function ErrorScreen(): ReactElement {
  return (
    <View style={styles.screen}>
      <Text>Error occured while connecting to Firebase</Text>
    </View>
  );
}
