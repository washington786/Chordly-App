import { StyleSheet, View } from "react-native";
import React, { FC, ReactNode } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

interface Bottom {
  children: ReactNode;
  bottomSheetRef: any;
  handleSheetChanges: (index: number) => void;
}
const BottomSheetComponent: FC<Bottom> = ({ children,bottomSheetRef,handleSheetChanges }) => {
  return (
    <View style={styles.container}>
      <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default BottomSheetComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
