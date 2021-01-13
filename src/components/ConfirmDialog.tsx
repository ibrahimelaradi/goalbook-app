import React, { Fragment, ReactElement, useState } from "react";
import { StyleSheet, Text, Dimensions } from "react-native";
import {
  TextInput,
  HelperText,
  Button,
  Dialog,
  Portal,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import "firebase/auth";

const styles = StyleSheet.create({
  deleteButton: {
    marginVertical: Dimensions.get("window").height / 30,
    backgroundColor: "red",
    alignSelf: "center",
  },
  titleText: {
    paddingVertical: 5,
    fontSize: 20,
    fontWeight: "700",
  },
});

type PasswordParam = {
  currentPassword: "";
};

interface Props {
  cancelAction?(): void;
  onDismiss?(): void;
  confirmAction?(currentPassword: string): void;
  confirmText: string;
  title: string;
  visibility: boolean;
}

export function ConfirmDialog(props: Props): ReactElement {
  const { control, errors, handleSubmit } = useForm<PasswordParam>({
    defaultValues: {
      currentPassword: "",
    },
  });

  return (
    <Portal>
      <Dialog visible={props.visibility} onDismiss={props.onDismiss}>
        <Dialog.Content>
          <Text style={styles.titleText}>{props.title}</Text>
          <Text style={{ paddingBottom: 10 }}>
            Enter your current password to continue.
          </Text>
          <Controller
            control={control}
            name="currentPassword"
            rules={{
              required: {
                value: true,
                message: "Please fill this field.",
              },
              minLength: {
                value: 8,
                message: "Password must be 8 characters or more.",
              },
            }}
            render={(props) => (
              <Fragment>
                <TextInput
                  accessibilityComponentType="input"
                  accessibilityTraits="input"
                  label="Current Password"
                  mode="outlined"
                  error={errors.currentPassword !== undefined}
                  textContentType="password"
                  secureTextEntry
                  value={props.value}
                  onChangeText={(v: string) => props.onChange(v)}
                  onBlur={props.onBlur}
                />
                <HelperText type="error">
                  {errors.currentPassword?.message}
                </HelperText>
              </Fragment>
            )}
          />
        </Dialog.Content>

        <Dialog.Actions>
          <Button
            accessibilityComponentType="button"
            accessibilityTraits="button"
            onPress={props.cancelAction}
          >
            Cancel
          </Button>
          <Button
            accessibilityComponentType="button"
            accessibilityTraits="button"
            onPress={handleSubmit(() => {
              props.confirmAction
                ? props.confirmAction(control.getValues().currentPassword)
                : {};
            })}
          >
            <Text style={{ color: "red" }}>{props.confirmText}</Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
