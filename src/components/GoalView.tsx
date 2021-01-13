import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import {
  Title,
  Subheading,
  Text,
  useTheme,
  Divider,
  ProgressBar,
  TouchableRipple,
  IconButton,
} from "react-native-paper";
import app from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import "firebase/firestore";
import "firebase/auth";
import { Spacing } from "./Spacing";
import { Like, User } from "~/types/firebase";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigatorNavigationProps } from "~/navigation";
import Avatar from "~/components/Avatar";

type Todo = {
  title: string;
  done: boolean;
};

interface Props {
  goalId: string;
  authorId: string;
  title: string;
  description: string;
  todos: Todo[];
  postedAt: app.firestore.Timestamp;
  onPress?(): void;
}

export function GoalView(props: Props): ReactElement {
  const [user] = useAuthState(app.auth());
  const { colors } = useTheme();
  const [likes, loading, error] = useCollectionData<Like>(
    app.firestore().collection("goals").doc(props.goalId).collection("likes")
  );
  const [author] = useDocumentData<User>(
    app.firestore().collection("users").doc(props.authorId)
  );
  const navigation = useNavigation<DrawerNavigatorNavigationProps.GoalsToAllGoalsNavigationProps>();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 16,
    },
    progressContainer: {
      padding: 16,
      flexDirection: "column",
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 8,
    },
    progressText: {
      color: colors.primary,
    },
    authorInfoContainer: {
      paddingLeft: 16,
    },
    content: {
      alignItems: "stretch",
      padding: 16,
    },
    titleContainer: {
      paddingBottom: 8,
    },
    footer: {
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    likesContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  const allTodos: number = props.todos.length;
  const doneTodos: number = props.todos.filter((x) => x.done).length;
  const progress = allTodos === 0 ? "No todos" : doneTodos / allTodos;

  return (
    <TouchableRipple
      accessibilityComponentType="button"
      accessibilityTraits="button"
      onPress={() => {
        navigation.navigate("Goal", {
          goalId: props.goalId,
          authorId: props.authorId,
        });
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar author={author} />
          <View style={styles.authorInfoContainer}>
            <Subheading>{author ? author.displayName : "..."}</Subheading>
          </View>
        </View>
        <Divider accessibilityComponentType="div" accessibilityTraits="div" />
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Title>{props.title}</Title>
          </View>
          <Text accessibilityComponentType="p" accessibilityTraits="p">
            {props.description}
          </Text>
        </View>
        <Divider accessibilityComponentType="div" accessibilityTraits="div" />
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Subheading>Goal Progress</Subheading>
            <Subheading style={styles.progressText}>
              {typeof progress === "string"
                ? progress
                : `${Math.round(progress * 100)} %`}
            </Subheading>
          </View>
          <ProgressBar
            accessibilityComponentType="div"
            accessibilityTraits="div"
            progress={typeof progress === "number" ? progress : 0}
          />
        </View>
        <Divider accessibilityComponentType="div" accessibilityTraits="div" />
        <View style={styles.footer}>
          <View style={styles.likesContainer}>
            <IconButton
              icon="thumb-up"
              accessibilityComponentType="button"
              accessibilityTraits="button"
              size={18}
              color={
                likes
                  ? likes.some(
                      (like) => like.author === user?.uid && like.liked
                    )
                    ? colors.primary
                    : colors.disabled
                  : colors.disabled
              }
              style={{ backgroundColor: "transparent" }}
              onPress={() => {
                app
                  .firestore()
                  .collection("goals")
                  .doc(props.goalId)
                  .collection("likes")
                  .doc(user?.uid)
                  .set({
                    liked: likes
                      ? !likes.some(
                          (like) => like.author === user?.uid && like.liked
                        )
                      : true,
                    author: user?.uid,
                  });
              }}
            />
            <Spacing />
            <Text accessibilityComponentType="p" accessibilityTraits="p">
              {likes ? likes.filter((like) => like.liked).length : "..."}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text accessibilityComponentType="p" accessibilityTraits="p">
              {props.postedAt
                ? props.postedAt.toDate().toLocaleDateString()
                : "..."}
            </Text>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
}
