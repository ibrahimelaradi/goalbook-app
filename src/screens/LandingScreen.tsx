import React, { Fragment, ReactElement } from "react";
import { StyleSheet, KeyboardAvoidingView, ScrollView } from "react-native";
import {
  TextInput,
  HelperText,
  Button,
  Title,
  Divider,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import app, { FirebaseError } from "firebase/app";
import "firebase/auth";
import { LandingStackNavigationProps } from "~/navigation";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 16,
  },
  title: {
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
  },
});

type SignupParams = {
  displayName: string;
  emailAddress: string;
  password: string;
};

interface Props {
  navigation: LandingStackNavigationProps.LandingNavigationProps;
  route: any;
}

export function LandingScreen(props: Props): ReactElement {
  // * Signup form control hook
  const { control, errors, handleSubmit } = useForm<SignupParams>({
    defaultValues: {
      displayName: "",
      emailAddress: "",
      password: "",
    },
  });
  /**
   * Handle firebase errors if any
   * @param err Firebase error
   */
  function handleFirebaseError(err: FirebaseError) {
    console.log(err.code);
  }
  /**
   * Handle sign up attempts
   * @param data Sign up parameters
   */
  async function onSubmit(data: SignupParams) {
    // TODO Start loading
    // ! Might change focus to main screen after login
    // ! and result in a no op
    try {
      const response = await app
        .auth()
        .createUserWithEmailAndPassword(data.emailAddress, data.password);

      await app.firestore().collection("users").doc(response.user?.uid).set({
        displayName: data.displayName,
        signupTimestamp: app.firestore.FieldValue.serverTimestamp(),
      });

      if (response.user) {
        // * Set the display name of the user
        await response.user.updateProfile({
          displayName: data.displayName,
        });
        // TODO Stop loading
      } else {
        // ! Workaround?
        throw new Error("User is undefined, could not change display name.");
      }
    } catch (err) {
      // TODO Stop loading
      handleFirebaseError(err);
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <KeyboardAvoidingView behavior="position">
        <Title style={styles.title}>Sign up</Title>
        <Divider accessibilityTraits="none" accessibilityComponentType="none" />
        <Controller
          control={control}
          name="displayName"
          rules={{
            required: {
              value: true,
              message: "Please fill this field.",
            },
          }}
          render={(props) => (
            <Fragment>
              <TextInput
                accessibilityComponentType="input"
                accessibilityTraits="input"
                textContentType="name"
                label="Name"
                mode="outlined"
                error={errors.displayName !== undefined}
                value={props.value}
                onChangeText={(v: string) => props.onChange(v)}
                onBlur={props.onBlur}
              />
              <HelperText type="error">
                {errors.displayName?.message}
              </HelperText>
            </Fragment>
          )}
        />
        <Controller
          control={control}
          name="emailAddress"
          rules={{
            validate: (v: string) => (isEmail(v) ? true : "Invalid email"),
            required: {
              value: true,
              message: "Please fill this field.",
            },
          }}
          render={(props) => (
            <Fragment>
              <TextInput
                accessibilityComponentType="input"
                accessibilityTraits="input"
                label="Email"
                textContentType="emailAddress"
                autoCompleteType="email"
                mode="outlined"
                autoCapitalize="none"
                error={errors.emailAddress !== undefined}
                value={props.value}
                onChangeText={(v: string) => props.onChange(v)}
                onBlur={props.onBlur}
              />
              <HelperText type="error">
                {errors.emailAddress?.message}
              </HelperText>
            </Fragment>
          )}
        />
        <Controller
          control={control}
          name="password"
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
                label="Password"
                mode="outlined"
                error={errors.password !== undefined}
                textContentType="newPassword"
                secureTextEntry
                value={props.value}
                onChangeText={(v: string) => props.onChange(v)}
                onBlur={props.onBlur}
              />
              <HelperText type="error">{errors.password?.message}</HelperText>
            </Fragment>
          )}
        />
        <Button
          accessibilityComponentType="button"
          accessibilityTraits="button"
          onPress={handleSubmit(onSubmit)}
          mode="contained"
          style={styles.button}
        >
          Sign Up
        </Button>
        <Button
          accessibilityComponentType="button"
          accessibilityTraits="button"
          onPress={() => props.navigation.navigate("Signin")}
          mode="text"
          style={styles.button}
        >
          Sign In
        </Button>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
