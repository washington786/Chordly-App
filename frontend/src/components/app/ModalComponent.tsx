import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React, { FC } from "react";
import { IconButton, Modal } from "react-native-paper";

interface mod {
  children: any;
  onClose?: () => void;
  visible: boolean;
  closeModal: () => void;
  btnStyle?: StyleProp<ViewStyle>;
}
const ModalComponent: FC<mod> = ({
  children,
  visible,
  onClose,
  closeModal,
  btnStyle,
}) => {
  return (
    <Modal
      onDismiss={onClose}
      visible={visible}
      contentContainerStyle={{ flex: 1, backgroundColor: "white" }}
    >
      <View style={styles.wrap}>
        <View style={styles.align}>
          <IconButton icon={"close"} onPress={closeModal} style={btnStyle} />
        </View>
        {children}
      </View>
    </Modal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 5,
  },
  align: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    zIndex: 100,
  },
});
