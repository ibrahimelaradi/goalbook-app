import React, { Fragment, ReactElement, useEffect, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import { TextInput, HelperText, Button, Avatar } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import app, { FirebaseError } from "firebase/app";
import "firebase/auth";
import { DrawerNavigatorNavigationProps } from "~/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import * as ImagePicker from "expo-image-picker";
import { Spacing } from "~/components/Spacing";
import { ConfirmDialog } from "~/components/ConfirmDialog";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 16,
  },
  deleteButton: {
    marginVertical: Dimensions.get("window").height / 30,
    backgroundColor: "red",
    alignSelf: "center",
  },
  displayPicture: {
    alignSelf: "center",
    marginVertical: Dimensions.get("window").height / 50,
  },
  button: {
    alignSelf: "center",
  },
});

type AccountParams = {
  displayName: string;
  emailAddress: string;
  newPassword: "";
};

interface Props {
  navigation: DrawerNavigatorNavigationProps.AccountDrawerNavigationProp;
  route: any;
}

export function EditAccountScreen(props: Props): ReactElement {
  const [user] = useAuthState(app.auth());

  // To update the picture if the user changes it.
  const [userPhoto, setUserPhoto] = useState(user?.photoURL);

  // This is used for displaying confirm dialog on delete account
  const [visibleDeleteAcc, setVisibleDeleteAcc] = useState(false);

  // This is used for displaying confirm dialog on change password

  const [visibleChangePass, setVisibleChangePass] = useState(false);
  // * Account form control hook

  const { control, errors, handleSubmit } = useForm<AccountParams>({
    defaultValues: {
      displayName: user?.displayName ?? "",
      emailAddress: user?.email ?? "",
      newPassword: "",
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
   * Handle user details change attempts
   * @param data user parameters
   */

  function onSubmit(data: AccountParams) {
    // TODO Start loading, then update details:

    if (data.displayName != user?.displayName) updateDisplayName(data);
    if (data.newPassword != "") setVisibleChangePass(true);
  }

  function updatePassword(currentPassword: string, data: AccountParams) {
    if (currentPassword == "") {
      alert("You need to re-enter your current password to change it.");
      return;
    }

    let credential = app.auth.EmailAuthProvider.credential(
      data.emailAddress,
      currentPassword
    );

    try {
      user
        ?.reauthenticateWithCredential(credential)
        .then(async (authResponse) => {
          await authResponse.user?.updatePassword(data.newPassword);
        });

      setVisibleChangePass(false);
    } catch (err) {
      handleFirebaseError(err);
    }
  }

  async function updateDisplayName(data: AccountParams) {
    try {
      console.log(`Updating name with ${data.displayName}`);

      await app.firestore().collection("users").doc(user?.uid).update({
        displayName: data.displayName,
      });

      user?.updateProfile({
        displayName: data.displayName,
      });
    } catch (err) {
      handleFirebaseError(err);
    }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if (status !== "granted") {
      alert(
        "Please enable permissions to access your media library and choose a picture."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.5,
      // base64: true,
    });

    if (!result.cancelled) {
      //uploadBase64Image(result.base64);
      updateUserImage(result.uri);
    }
  }

  async function uploadBase64Image(base64Image: string) {
    //this was only for testing:
    let base64File = "data:image/jpeg;base64," + base64Image;

    let imageName: String = user?.uid + "_pp.jpg";
    let storageRef = app
      .storage()
      .ref()
      .child(`/users/${user?.uid}/pps/${imageName}`);

    try {
      console.log(base64Image); // to ensure base64 string is actually recieved
      storageRef
        .putString(base64Image, "base64", {
          contentType: "image/jpeg",
        })
        .then(() => {
          global.Blob = Blob;
        });
    } catch (err) {
      console.log(err);
      //handleFirebaseError(err);
    }
  }

  async function updateUserImage(uri: string) {
    let imageFile = await fetch(uri).then(
      async (response) => await response.blob()
    );

    let imageName: String = user?.uid + "_pp.jpg";

    let imageRef = app
      .storage()
      .ref()
      .child(`/users/${user?.uid}/pps/${imageName}`);

    try {
      await imageRef
        .put(imageFile, {
          contentType: "image/jpeg",
        })
        .then((imageTask) => {
          imageTask.task.on(
            app.storage.TaskEvent.STATE_CHANGED,
            null,
            null,
            async () => {
              const imageURL: string = await imageTask.ref.getDownloadURL();
              user
                ?.updateProfile({
                  photoURL: imageURL,
                })
                .then(() => setUserPhoto(user?.photoURL));
              await app
                .firestore()
                .collection("users")
                .doc(user?.uid)
                .set({ displayPhoto: imageURL }, { merge: true });
              console.log("Finished changing the picture.");
            }
          );
        });
    } catch (err) {
      handleFirebaseError(err);
    }
  }

  async function deleteAccount(currentPassword: string, data: AccountParams) {
    try {
      // Remove the user personal details:
      await app.firestore().collection("users").doc(user?.uid).delete();

      // Get all goals and remove the ones made by this user:
      await app
        .firestore()
        .collection("goals")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data()["author"] == user?.uid) {
              doc.ref.delete();
            }
          });
        });

      let credential = app.auth.EmailAuthProvider.credential(
        data.emailAddress,
        currentPassword
      );

      user
        ?.reauthenticateWithCredential(credential)
        .then(async (authResponse) => {
          await authResponse.user?.delete();
        });

      // [No permissions to do this yet] Remove the user display picture:
      //await app.storage().ref().child(`/users/${user?.uid}`).delete();
    } catch (err) {
      handleFirebaseError(err);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <KeyboardAvoidingView behavior="position">
        <ConfirmDialog
          confirmText="Delete Account"
          title="Would you like to delete your account? This action cannot be undone!"
          visibility={visibleDeleteAcc}
          onDismiss={() => setVisibleDeleteAcc(false)}
          cancelAction={() => setVisibleDeleteAcc(false)}
          confirmAction={(currentPassword) =>
            deleteAccount(currentPassword, control.getValues())
          }
        />
        <ConfirmDialog
          confirmText="Change password"
          title="You are about to change your account password"
          visibility={visibleChangePass}
          onDismiss={() => setVisibleChangePass(false)}
          cancelAction={() => setVisibleChangePass(false)}
          confirmAction={(currentPassword) =>
            updatePassword(currentPassword, control.getValues())
          }
        />
        <Avatar.Image
          style={styles.displayPicture}
          accessibilityComponentType="img"
          accessibilityTraits="img"
          size={Dimensions.get("window").width / 4.2}
          source={{
            uri:
              userPhoto ||
              `https://ui-avatars.com/api/?name=${user?.displayName}`,
          }}
        />
        <Button
          accessibilityComponentType="button"
          accessibilityTraits="button"
          onPress={() => pickImage()}
          mode="outlined"
          style={styles.button}
        >
          Edit Profile Picture
        </Button>
        <Spacing></Spacing>
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
                disabled={true}
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
          name="newPassword"
          rules={{
            required: {
              value: false,
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
                label="New Password"
                mode="outlined"
                error={errors.newPassword !== undefined}
                textContentType="password"
                secureTextEntry
                value={props.value}
                onChangeText={(v: string) => props.onChange(v)}
                onBlur={props.onBlur}
              />
              <HelperText type="error">
                {errors.newPassword?.message}
              </HelperText>
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
          Save Changes
        </Button>
        <Button
          accessibilityComponentType="button"
          accessibilityTraits="button"
          onPress={() => setVisibleDeleteAcc(true)}
          mode="contained"
          style={styles.deleteButton}
        >
          Delete Account
        </Button>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
