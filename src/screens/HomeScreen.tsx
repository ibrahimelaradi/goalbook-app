import React, { Fragment, ReactElement } from "react";
import { View, StyleSheet, ScrollView, Text, FlatList } from "react-native";
import { Divider, FAB, Subheading } from "react-native-paper";
import app from "firebase/app";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import "firebase/firestore";
import { DrawerNavigatorNavigationProps } from "~/navigation";
import { GoalView } from "~/components/GoalView";
import { Goal } from "~/types/firebase";
import { Spacing } from "~/components/Spacing";

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 16,
  },
  fabConatiner: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 16,
    position: "absolute",
    bottom: 0,
  },
  listContainer: {
    padding: 16,
  },
  emptyListText: {
    textAlign: "center",
    padding: 16,
  },
});

interface Props {
  navigation: DrawerNavigatorNavigationProps.GoalsToAllGoalsNavigationProps;
  route: any;
}

export function HomeScreen(props: Props): ReactElement {
  const [goalsSnapshot, loading, error] = useCollection(
    app.firestore().collection("goals").orderBy("postedAt", "desc"),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    }
  );
  return (
    <Fragment>
      <View style={styles.screen}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 74 }}
          data={goalsSnapshot?.docs || []}
          ListEmptyComponent={() => (
            <Subheading style={styles.emptyListText}>
              {error ? "Failed to get goals." : "No goals found."}
            </Subheading>
          )}
          ItemSeparatorComponent={Spacing}
          renderItem={(props) => {
            const data: Goal = props.item.data() as Goal;
            return (
              <GoalView
                authorId={data.author}
                title={data.title}
                description={data.description}
                goalId={props.item.id} // TODO Include the ID of the document
                postedAt={data.postedAt}
                todos={data.todos}
              />
            );
          }}
          keyExtractor={(item, index) => item.id}
        />
      </View>
      <View style={styles.fabConatiner}>
        <FAB
          icon="lead-pencil"
          accessibilityTraits="button"
          accessibilityComponentType="button"
          onPress={() => props.navigation.navigate("PostGoal")}
        />
      </View>
    </Fragment>
  );
}
