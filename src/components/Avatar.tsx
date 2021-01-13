import React, { ReactElement } from "react";
import { Avatar } from "react-native-paper";
import { User } from "~/types/firebase";

interface Props {
  author?: User;
  size?: number;
}

export default function ({ author, size = 32 }: Props): ReactElement {
  return author ? (
    author.displayPhoto ? (
      <Avatar.Image
        accessibilityTraits="img"
        size={size}
        accessibilityComponentType="img"
        source={{ uri: author.displayPhoto }}
      />
    ) : (
      <Avatar.Text
        accessibilityTraits="img"
        accessibilityComponentType="img"
        size={size}
        label={author.displayName.split(" ")[0][0]}
      />
    )
  ) : (
    <Avatar.Text
      accessibilityTraits="img"
      accessibilityComponentType="img"
      size={size}
      label="!"
    />
  );
}
