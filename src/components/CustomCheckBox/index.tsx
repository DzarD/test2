import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

interface CustomCheckBoxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ label, checked, onToggle }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
      <View style={styles.checkbox}>
        {checked ? <Text style={styles.checkmark}>{"\u2713"}</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckBox;
