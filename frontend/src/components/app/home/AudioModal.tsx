import { Modal, StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";

interface AudioModalProps {
  onPress?(): void;
  isVisible: boolean;
  children: ReactNode;
}
function AudioModal({ isVisible, onPress, children }: AudioModalProps) {
  return (
    <Modal
      visible={isVisible}
      onDismiss={onPress}
      animationType="slide"
      transparent={false}
      style={styles.con}
    >
      {children}
    </Modal>
  );
}

export default AudioModal;

const styles = StyleSheet.create({
  con: { flex: 1, backgroundColor: "white", position: "relative" },
});
