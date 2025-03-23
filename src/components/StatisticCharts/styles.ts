import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    columnGap: 10,
  },
  button: {
    borderWidth: 2,
  },
  noDataText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default styles;
