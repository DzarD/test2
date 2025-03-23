import { StyleSheet } from "react-native";
import { DefaultModeColors, DarkModeColors } from "../../constants";

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
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
    marginRight: 10,
  },
  checkmark: {
    fontSize: 18,
    color: DefaultModeColors.accent,
    fontWeight: "bold",
  },
  label: {
    color: DefaultModeColors.text,
  },
});

export default styles;
