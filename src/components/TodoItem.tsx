import React, { ReactElement, useState } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Checkbox, TextInput, useTheme } from "react-native-paper";
import { useDebounceFn } from "ahooks";

type Todo = {
  title: string;
  done: boolean;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    paddingRight: 8,
  },
});

interface EditableProps {
  onChange?(state: Todo): void;
  onDelete?(): void;
  state: Todo;
}

export function EditableTodoItem(props: EditableProps): ReactElement {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          accessibilityComponentType="input"
          accessibilityTraits="input"
          mode="outlined"
          placeholder="Todo Title"
          value={props.state.title}
          onChangeText={(v: string) => {
            if (props.onChange) props.onChange({ ...props.state, title: v });
            // if (props.onChange)
            //   props.onChange({
            //     ...state,
            //     title: v,
            //   });
          }}
        />
      </View>
      <Checkbox.Android
        accessibilityComponentType="input"
        accessibilityTraits="input"
        status={props.state.done ? "checked" : "unchecked"}
        onPress={() => {
          if (props.onChange)
            props.onChange({
              ...props.state,
              done: !props.state.done,
            });
        }}
      />
      <IconButton
        accessibilityComponentType="button"
        accessibilityTraits="button"
        icon="delete"
        color={colors.notification}
        onPress={props.onDelete}
      />
    </View>
  );
}
