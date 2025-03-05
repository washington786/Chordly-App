import React, { FC } from "react";
import { Paragraph, TextInput, TextInputProps } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import { white } from "@styles/Colors";
import InputError from "./InputError";

const Input: FC<TextInputProps> = ({
  placeholder,
  keyboardType,
  textContentType,
  ...props
}) => {
  return (
    <>
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        textContentType={textContentType}
        keyboardType={keyboardType}
        style={[GlobalStyles.textInput, GlobalStyles.outline]}
        outlineColor={white[50]}
        placeholderTextColor={white[100]}
        activeOutlineColor={white[200]}
        cursorColor={white[200]}
        textColor="#ffff"
        {...props}
      />
    </>
  );
};

export default Input;
