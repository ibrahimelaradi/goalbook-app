import React, { ReactElement } from "react";
import { View } from "react-native";

interface Props {
  spacing?: number;
}

export function Spacing(props: Props): ReactElement {
  return <View style={{ padding: props.spacing || 4 }} />;
}
