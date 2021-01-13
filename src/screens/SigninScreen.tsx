import React, { Fragment, ReactElement } from "react";
import { ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Divider,
  HelperText,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import app, { FirebaseError } from "firebase/app";
import "firebase/auth";

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

type SigninParams = {
  emailAddress: string;
  password: string;
};

interface Props {
  navigation: any;
  route: any;
}

export function SigninScreen(props: Props): ReactElement {
  // * Sign in form control hook
  const { control, errors, handleSubmit } = useForm<SigninParams>({
    defaultValues: {
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
   * Attempt signing into firebase auth
   * @param data Sign in parameters
   */
  async function onSubmit(data: SigninParams) {
    // TODO Start loading
    try {
      await app
        .auth()
        .signInWithEmailAndPassword(data.emailAddress, data.password);
      // TODO Stop loading
    } catch (err) {
      // TODO Stop loading
      handleFirebaseError(err);
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <KeyboardAvoidingView behavior="position">
        <Title style={styles.title}>Sign In</Title>
        <Divider accessibilityComponentType="none" accessibilityTraits="none" />
        <Controller
          control={control}
          name="emailAddress"
          rules={{
            validate: (v: string) => (isEmail(v) ? true : "Invalid email"),
            required: {
              value: true,
              message: "Please fill this field",
            },
          }}
          render={(props) => (
            <Fragment>
              <TextInput
                label="Email"
                accessibilityComponentType="input"
                accessibilityTraits="input"
                mode="outlined"
                error={errors.emailAddress !== undefined}
                textContentType="emailAddress"
                autoCompleteType="email"
                autoCapitalize="none"
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
            minLength: {
              value: 8,
              message: "Invalid password",
            },
            required: {
              value: true,
              message: "Please fill this field",
            },
          }}
          render={(props) => (
            <Fragment>
              <TextInput
                label="Password"
                accessibilityComponentType="input"
                accessibilityTraits="input"
                mode="outlined"
                error={errors.password !== undefined}
                textContentType="password"
                autoCompleteType="password"
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
          accessibilityTraits="button"
          accessibilityComponentType="button"
          style={styles.button}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        >
          Sign in
        </Button>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
