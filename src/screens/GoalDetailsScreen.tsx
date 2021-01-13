import React, { Fragment, ReactElement, useReducer, useState } from "react";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { View, StyleSheet, Text, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Comment, Goal, GoalWithLikes, Like, User } from "~/types/firebase";
import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  Divider,
  IconButton,
  ProgressBar,
  Subheading,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import Avatar from "~/components/Avatar";
import { Spacing } from "~/components/Spacing";
import { GoalViewRouteProp } from "~/navigation/DrawerNavigator/HomeStack/RouteProps";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoalsToGoalViewNavigationProps } from "~/navigation/DrawerNavigator/NavigationProps";
import Menu from "~/components/Menu";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  section: {
    padding: 16,
  },
  userInfoContainer: {
    padding: 0,
    flexDirection: "row",
  },
  userInfoInnerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  screenContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  commentInputContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    alignItems: "stretch",
  },
  commentContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  commentAuthorName: {
    fontWeight: "700",
  },
  commentContentContainer: {
    flex: 1,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

interface Props {
  route: GoalViewRouteProp;
  navigation: GoalsToGoalViewNavigationProps;
}
export function GoalDetailsScreen(props: Props): ReactElement {
  const { colors } = useTheme();
  const [user] = useAuthState(app.auth());
  const { goalId, authorId } = props.route.params;
  const [goal] = useDocumentData<Goal>(
    app.firestore().collection("goals").doc(goalId)
  );
  const [commentsSN] = useCollection(
    app.firestore().collection("goals").doc(goalId).collection("comments")
  );
  const [likes] = useCollectionData<Like>(
    app.firestore().collection("goals").doc(goalId).collection("likes")
  );
  const [author] = useDocumentData<User>(
    app.firestore().collection("users").doc(authorId)
  );
  const allTodos: number = goal?.todos.length || 0;
  const doneTodos: number = goal?.todos.filter((x) => x.done).length || 0;
  const progress = allTodos === 0 ? "No todos" : doneTodos / allTodos;

  function deleteGoal() {
    //TODO Maybe use the same style?
    Alert.alert("Deleting Goal", "Are you sure you want to delete this goal?", [
      {
        text: "Confirm",
        onPress: async () => {
          await app.firestore().collection("goals").doc(goalId).delete();
          props.navigation.goBack();
          props.navigation.navigate("Home");
        },
      },
      {
        text: "cancel",
        style: "cancel",
      },
    ]);
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.section}>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoInnerContainer}>
              <Avatar author={author} />
              <Spacing />
              <Subheading>{author ? author.displayName : "..."}</Subheading>
            </View>
            {goal?.author === user?.uid ? (
              <Menu
                items={[
                  {
                    label: "Edit",
                    icon: "pencil",
                    onPress: () =>
                      goal &&
                      props.navigation.navigate("EditGoal", {
                        goalId,
                        goal: {
                          author: goal.author,
                          description: goal.description,
                          title: goal.title,
                          todos: goal.todos,
                        },
                      }),
                  },
                  {
                    label: "Delete",
                    icon: "delete",
                    onPress: deleteGoal,
                  },
                ]}
              />
            ) : null}
          </View>
          <Spacing />
          <Title>{goal?.title}</Title>
          <Spacing />
          <Text>{goal?.description}</Text>
          <Spacing />
        </View>
        <View style={styles.section}>
          <Text style={{ color: colors.primary }}>
            {typeof progress === "string"
              ? progress
              : `Progress ${Math.round(progress * 100)} %`}
          </Text>
          <Spacing />
          <ProgressBar
            accessibilityComponentType="div"
            accessibilityTraits="div"
            progress={typeof progress === "number" ? progress : 0}
          />
        </View>
        <View style={[styles.section, styles.likesContainer]}>
          <IconButton
            icon="thumb-up"
            accessibilityComponentType="button"
            accessibilityTraits="button"
            size={18}
            color={
              likes
                ? likes.some((like) => like.author === user?.uid && like.liked)
                  ? colors.primary
                  : colors.disabled
                : colors.disabled
            }
            style={{ backgroundColor: "transparent" }}
            onPress={() => {
              app
                .firestore()
                .collection("goals")
                .doc(goalId)
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
          <Text>
            {likes ? likes.filter((like) => like.liked).length : "..."}
          </Text>
        </View>
        <Divider accessibilityComponentType="div" accessibilityTraits="div" />
        <View style={styles.section}>
          <Subheading>Comments</Subheading>
        </View>
        {commentsSN
          ? commentsSN.docs.map((commentSN, index) => (
              <Fragment key={`${commentSN.id}_${index}`}>
                <CommentView
                  comment={commentSN.data() as Comment}
                  commentId={commentSN.id}
                  goalId={goalId}
                />
                <Divider
                  accessibilityTraits="div"
                  accessibilityComponentType="div"
                />
              </Fragment>
            ))
          : null}
      </ScrollView>
      <CommentInput
        onSubmit={(content) => {
          app
            .firestore()
            .collection("goals")
            .doc(goalId)
            .collection("comments")
            .add({
              author: user?.uid,
              content,
            });
        }}
      />
    </View>
  );
}

interface CommentViewProps {
  goalId: string;
  commentId: string;
  comment: Comment;
}

function CommentView({
  goalId,
  comment,
  commentId,
}: CommentViewProps): ReactElement {
  const { colors } = useTheme();
  const [user] = useAuthState(app.auth());
  const [author] = useDocumentData<User>(
    app.firestore().collection("users").doc(comment.author)
  );
  return (
    <View style={styles.commentContainer}>
      <Avatar author={author} size={25} />
      <Spacing />

      <View style={styles.commentContentContainer}>
        <Text style={styles.commentAuthorName}>
          {author?.displayName ?? ".."}
        </Text>
        <Text>{comment.content}</Text>
      </View>
      {comment.author === user?.uid ? (
        <IconButton
          icon="delete"
          accessibilityComponentType="button"
          accessibilityTraits="button"
          color={colors.error}
          size={16}
          onPress={() => {
            app
              .firestore()
              .collection("goals")
              .doc(goalId)
              .collection("comments")
              .doc(commentId)
              .delete();
          }}
        />
      ) : null}
    </View>
  );
}

interface CommentInputProps {
  onSubmit?(content: string): void;
}
function CommentInput(props: CommentInputProps) {
  const [content, setContent] = useState("");
  function handleSubmit() {
    if (props.onSubmit) props.onSubmit(content);
    setContent("");
  }
  return (
    <View style={styles.commentInputContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          accessibilityTraits="input"
          accessibilityComponentType="input"
          onChangeText={setContent}
          mode="outlined"
          placeholder="Write a comment.."
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
          value={content}
        />
      </View>
      <Spacing />
      <IconButton
        accessibilityTraits="button"
        accessibilityComponentType="button"
        icon="send"
        onPress={handleSubmit}
      />
    </View>
  );
}
