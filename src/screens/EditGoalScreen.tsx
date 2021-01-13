import React, { Fragment, ReactElement, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Title, TextInput, Divider, Button, FAB } from "react-native-paper";
import app, { FirebaseError } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { Spacing } from "~/components/Spacing";
import { EditableTodoItem } from "~/components/TodoItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoalsToEditGoalNavigationProps } from "~/navigation/DrawerNavigator/NavigationProps";
import { EditGoalRouteProp } from "~/navigation/DrawerNavigator/HomeStack/RouteProps";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  fabContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 16,
  },
  section: {
    alignItems: "stretch",
  },
  sectionPadding: {
    padding: 16,
  },
  todoList: {
    paddingBottom: 64, // * To avoid FAB overlapping
    paddingHorizontal: 16,
  },
});

type Todo = {
  title: string;
  done: boolean;
};

type GoalPostParams = {
  title: string;
  description: string;
  todos: Todo[];
};

interface Props {
  navigation: GoalsToEditGoalNavigationProps;
  route: EditGoalRouteProp;
}

export function EditGoalScreen(props: Props): ReactElement {
  const { goalId, goal } = props.route.params;
  // * Get auth state for user ID on post
  const [user] = useAuthState(app.auth());

  // * Keep track of added todos
  const [todos, setTodos] = useState<Todo[]>(goal.todos);

  // * State of the goal title
  const [title, setTitle] = useState<string>(goal.title);

  // * State of the goal description
  const [description, setDescription] = useState<string>(goal.description);
  /**
   * Handle firebase errors if any
   * @param err Firebase error
   */
  function handleError(err: FirebaseError) {
    // TODO Handle firebase errors
    console.log(err.code);
  }

  /**
   * Handle goal submission to firebase
   */
  async function handleGoalSubmit() {
    // TODO Start loading
    try {
      await app.firestore().collection("goals").doc(goalId).update({
        title,
        description,
        todos,
      });
      props.navigation.goBack();
      // TODO Stop loading and prompt user of success
    } catch (err) {
      // TODO Stop loading
      handleError(err as FirebaseError);
    }
  }

  return (
    <Fragment>
      <ScrollView style={styles.screen}>
        <View style={[styles.section, styles.sectionPadding]}>
          <Title>Edit Goal</Title>
          <Spacing />
          <TextInput
            accessibilityComponentType="input"
            accessibilityTraits="input"
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
          />
          <Spacing />
          <TextInput
            accessibilityComponentType="input"
            accessibilityTraits="input"
            label="Description"
            mode="outlined"
            textAlignVertical="top"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <Divider accessibilityTraits="div" accessibilityComponentType="div" />
        <View style={[styles.section, { flex: 1 }]}>
          <View style={styles.subheader}>
            <Title>Todos</Title>
            <Button
              accessibilityComponentType="button"
              accessibilityTraits="button"
              icon="plus"
              mode="text"
              onPress={() => {
                setTodos([...todos, { title: "", done: false }]);
              }}
            >
              Add
            </Button>
          </View>
          <Divider accessibilityComponentType="div" accessibilityTraits="div" />
          <View style={styles.todoList}>
            {todos.map((todo, index) => (
              <EditableTodoItem
                key={`todo_${index}`}
                state={todo}
                onChange={(state) => {
                  const copy = [...todos];
                  copy[index] = state;
                  setTodos(copy);
                }}
                onDelete={() => {
                  const copy = [...todos];
                  copy.splice(index, 1);
                  setTodos(copy);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.fabContainer}>
        <FAB
          accessibilityComponentType="button"
          accessibilityTraits="button"
          icon="check-bold"
          onPress={handleGoalSubmit}
        />
      </View>
    </Fragment>
  );
}
