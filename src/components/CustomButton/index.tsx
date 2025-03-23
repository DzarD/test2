import React from "react";
import { TouchableOpacity, Text, GestureResponderEvent, StyleProp, ViewStyle, TextStyle } from "react-native";
import styles from "./styles";
import { DefaultModeColors, DarkModeColors } from "../../constants";

interface CustomButtonProps {
  title: string;
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, viewStyle, textStyle, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: DefaultModeColors.accent }, viewStyle]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
