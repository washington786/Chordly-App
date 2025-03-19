import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Input from "@components/auth/Input";
import { Button, ToggleButton } from "react-native-paper";

interface PlaylistFormProps {
  value: "public" | "private";
  onChange(value: "public" | "private"): void;
  onSubmit: () => void;
  onValChange: (value: string) => void;
  title: string;
}

const PlaylistForm = ({
    onChange,
    value,
    onSubmit,
    title,
    onValChange,
  }: PlaylistFormProps) => {
    return (
      <View>
        <Input
          placeholder="title"
          style={{ borderColor: "gray", borderWidth: 1, marginVertical: 5 }}
          placeholderTextColor={"gray"}
          contentStyle={{ color: "gray" }}
          onChangeText={onValChange}
          value={title}
        />
        <View style={{ paddingVertical: 5 }}>
          <Text>Select Visibility Type</Text>
          <ToggleButton.Row value={value} onValueChange={onChange}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 4,
                paddingVertical: 5,
              }}
            >
              <ToggleButton icon={"earth"} value="public" />
              <Text>Public</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 4,
                paddingVertical: 5,
              }}
            >
              <ToggleButton icon={"lock"} value="private" />
              <Text>Private</Text>
            </View>
          </ToggleButton.Row>
        </View>
        <Button uppercase mode="contained" onPress={onSubmit}>
          Create
        </Button>
      </View>
    );
  };

export default PlaylistForm;

const styles = StyleSheet.create({});
