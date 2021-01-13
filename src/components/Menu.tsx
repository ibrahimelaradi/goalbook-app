import React, { Fragment, ReactElement, useState } from "react";
import { Menu, IconButton } from "react-native-paper";

type Item = {
  label: string;
  icon?: string;
  onPress?(): void;
};

interface Props {
  items: Item[];
}

export default function ({ items }: Props): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  function openMenu() {
    setOpen(true);
  }
  function closeMenu() {
    setOpen(false);
  }
  return (
    <Fragment>
      <Menu
        anchor={
          <IconButton
            icon="dots-vertical"
            accessibilityComponentType="button"
            accessibilityTraits="button"
            onPress={openMenu}
          />
        }
        visible={open}
        onDismiss={closeMenu}
      >
        {items.map((item) => (
          <Menu.Item
            key={item.label}
            icon={item.icon}
            title={item.label}
            onPress={() => {
              if (item.onPress) item.onPress();
              closeMenu();
            }}
          />
        ))}
      </Menu>
    </Fragment>
  );
}
