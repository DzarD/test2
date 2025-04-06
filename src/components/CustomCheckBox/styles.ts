import { StyleSheet } from "react-native";
import { DefaultModeColors, DarkModeColors } from "../../constants";

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: DefaultModeColors.border,
    color: DefaultModeColors.text,
  },
  checkmark: {
    fontSize: 18,
    color: DefaultModeColors.accent,
    fontWeight: "bold",
  },
  label: {
    marginLeft: 10,
    color: DefaultModeColors.text,
  },
});

export default styles;
