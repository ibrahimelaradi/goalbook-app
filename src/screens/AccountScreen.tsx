import React, { ReactElement, useEffect, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  View,
  Text,
} from "react-native";
import { Button, Avatar, TouchableRipple, Divider } from "react-native-paper";
import app from "firebase/app";
import "firebase/auth";
import { DrawerNavigatorNavigationProps } from "~/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spacing } from "~/components/Spacing";
import { Svg } from "react-native-svg";
import {
  VictoryLegend,
  VictoryPie,
  VictoryBar,
  VictoryChart,
} from "victory-native";
import { useCollection } from "react-firebase-hooks/firestore";

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 16,
  },
  displayPicture: {
    alignSelf: "center",
    marginVertical: Dimensions.get("window").height / 50,
  },
  button: {
    alignSelf: "center",
  },
  nameStyle: {
    fontSize: 16,
  },
  personalInfoStyle: {
    flexDirection: "row",
    alignItems: "stretch",
    alignContent: "space-between",
    paddingHorizontal: 10,
  },
  centerItem: { alignSelf: "center" },
  emailStyle: {
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    fontWeight: "300",
    color: "grey",
    fontSize: 15,
  },
  displayName: {
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    fontWeight: "700",
    fontSize: 20,
  },
  customButton: {
    padding: 5,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    elevation: 4,
  },
  statsTitle: {
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: 13,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    textTransform: "uppercase",
    padding: 10,
  },
  buttonItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

interface Props {
  navigation: DrawerNavigatorNavigationProps.AccountToEditAccountNavigationProps;
  route: any;
}

export function AccountScreen(props: Props): ReactElement {
  const [user] = useAuthState(app.auth());
  const [goalsCompletedPercent, setGoalsCompletedPercent] = useState(0);
  const [onGoingGoalsPercent, setOnGoingGoalsPercent] = useState(0);
  const [goalsNotStartedPercent, setGoalsNotStartedPercent] = useState(0);
  const [allUserGoals, setAllUserGoals] = useState(0);

  const [completedGoals, setCompletedGoals] = useState(0);
  const [onGoingGoals, setOnGoingGoals] = useState(0);
  const [goalsNotStarted, setGoalsNotStarted] = useState(0);

  const [goalsSnapshot, loading, error] = useCollection(
    app.firestore().collection("goals").where("author", "==", user?.uid),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    }
  );

  const [displayName, setDisplayName] = useState(user?.displayName);
  const [userPhoto, setUserPhoto] = useState(user?.photoURL);

  // To update the name if the user changes their name on EditAccount.
  useEffect(() => {
    const subName = props.navigation.addListener("focus", () => {
      setDisplayName(user?.displayName);
    });
    return subName;
  }, [props.navigation]);

  // To update the picture if the user changes it on Edit Account.

  useEffect(() => {
    const subPhoto = props.navigation.addListener("focus", () => {
      setUserPhoto(user?.photoURL);
    });
    return subPhoto;
  }, [props.navigation]);

  useEffect(() => {
    setAllUserGoals(goalsSnapshot?.size ?? 0);
    if (allUserGoals == 0) return;
    var goalsCompleted = 0;
    var onGoingGoals = 0;
    var goalsNotStarted = 0;

    goalsSnapshot?.forEach((element) => {
      let todos = element.data()["todos"];
      let finishedTodos = todos.filter((item: any) => item["done"] == true);
      let numberOfTodos = todos.length;
      let numberOfFinishedTodos = finishedTodos.length;

      if (numberOfFinishedTodos == numberOfTodos) {
        goalsCompleted += 1;
      } else if (numberOfFinishedTodos == 0) {
        goalsNotStarted += 1;
      } else if (
        numberOfFinishedTodos > 0 &&
        numberOfFinishedTodos < numberOfTodos
      ) {
        onGoingGoals += 1;
      }
    });

    setGoalsCompletedPercent((goalsCompleted / allUserGoals) * 100);
    setOnGoingGoalsPercent((onGoingGoals / allUserGoals) * 100);
    setGoalsNotStartedPercent((goalsNotStarted / allUserGoals) * 100);
    setCompletedGoals(goalsCompleted);
    setOnGoingGoals(onGoingGoals);
    setGoalsNotStarted(goalsNotStarted);
  });

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <KeyboardAvoidingView behavior="position">
        <View>
          <View style={styles.personalInfoStyle}>
            <Avatar.Image
              style={styles.displayPicture}
              accessibilityComponentType="img"
              accessibilityTraits="img"
              size={Dimensions.get("window").width / 4.2}
              source={{
                uri:
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${user?.displayName}`,
              }}
            />
            <View style={styles.centerItem}>
              <Text style={styles.displayName}>{displayName}</Text>
              <Text style={styles.emailStyle}>{user?.email}</Text>
            </View>
          </View>
          <Button
            accessibilityComponentType="button"
            accessibilityTraits="button"
            onPress={() => props.navigation.navigate("EditAccount")}
            mode="outlined"
            style={styles.button}
          >
            Edit Account
          </Button>
        </View>
        <Spacing></Spacing>
        <Divider
          style={{ padding: 1 }}
          accessibilityComponentType="div"
          accessibilityTraits="div"
        />
        <View style={{ paddingVertical: 15 }}>
          <TouchableRipple
            onPress={() => props.navigation.navigate("PersonalGoals")}
            accessibilityComponentType="button"
            accessibilityTraits="button"
            rippleColor="rgba(0, 0, 0, .15)"
            borderless={true}
            style={styles.customButton}
          >
            <View style={styles.buttonItems}>
              <Text style={styles.buttonText}>View personal goals</Text>
              <Avatar.Icon
                accessibilityComponentType="icon"
                accessibilityTraits="icon"
                icon="arrow-right"
                size={40}
              />
            </View>
          </TouchableRipple>
        </View>
        <Text style={styles.statsTitle}>Your goals stats</Text>

        <Divider
          style={{ padding: 0.5 }}
          accessibilityComponentType="div"
          accessibilityTraits="div"
        />

        {allUserGoals > 0 ? (
          <Svg
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height / 4}
          >
            <VictoryPie
              origin={{
                x: Dimensions.get("window").width / 3.29,
                y: Dimensions.get("window").height / 7.8,
              }}
              colorScale={["#00ff9d", "#007AFF", "#ff5e00"]}
              data={[
                {
                  x: `${goalsCompletedPercent.toFixed(1)}%`,
                  y: goalsCompletedPercent,
                }, // Goals completed
                {
                  x: `${onGoingGoalsPercent.toFixed(1)}%`,
                  y: onGoingGoalsPercent,
                }, // Ongoing goals, goals not completed but has a percentage > 0%
                {
                  x: `${goalsNotStartedPercent.toFixed(1)}%`,
                  y: goalsNotStartedPercent,
                }, // Goals not started, has a percentage == 0%
              ]}
              standalone={false}
              width={Dimensions.get("window").width / 1.8}
              style={{ parent: { maxWidth: "50%" } }}
            />
            <VictoryLegend
              standalone={false}
              colorScale="green"
              x={Dimensions.get("window").width / 1.62}
              y={Dimensions.get("window").height / 17}
              gutter={19}
              title="Legend"
              centerTitle
              style={{ border: { stroke: "black" }, labels: { fontSize: 11 } }}
              data={[
                {
                  name: "Goals Completed",
                  symbol: { fill: "#00ff9d" },
                },
                { name: "Goals In Progress", symbol: { fill: "#007AFF" } },
                { name: "Goals Not Started", symbol: { fill: "#ff5e00" } },
              ]}
            />
          </Svg>
        ) : (
          <Text style={{ alignSelf: "center", paddingVertical: 20 }}>
            You've not added any goal.
          </Text>
        )}

        {allUserGoals > 0 ? (
          <VictoryChart
            domainPadding={25}
            height={Dimensions.get("window").height / 2.8}
            padding={{
              right: Dimensions.get("window").width / 5.5,
              left: Dimensions.get("window").width / 10,
              bottom: Dimensions.get("window").height / 13,
              top: Dimensions.get("window").height / 20,
            }}
          >
            <VictoryBar
              animate={{
                duration: 500,
                onLoad: { duration: 500 },
                onEnter: { duration: 500 },
              }}
              style={{ data: { fill: "#007AFF" } }}
              domain={{ y: [0, allUserGoals < 5 ? 5 : allUserGoals] }}
              data={[
                {
                  x: "Goals Completed",
                  y: completedGoals,
                }, // Goals completed
                {
                  x: "Goals In Progress",
                  y: onGoingGoals,
                }, // Ongoing goals, goals not completed but has a percentage > 0%
                {
                  x: "Goals Not Started",
                  y: goalsNotStarted,
                }, // Goals not started, has a percentage == 0%
              ]}
            />
          </VictoryChart>
        ) : null}
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
