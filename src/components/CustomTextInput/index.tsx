import React from "react";
import { TextInput, TextInputProps } from "react-native";
import styles from "./styles";
import { DefaultModeColors, DarkModeColors } from "../../constants";

const CustomTextInput: React.FC<TextInputProps> = ({ style, ...props }) => {
  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: DefaultModeColors.border,
          color: DefaultModeColors.text,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default CustomTextInput;
