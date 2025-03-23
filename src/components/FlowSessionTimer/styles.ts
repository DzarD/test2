import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  timerContainer: {
    flex: 65,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tagContainer: {
    flex: 35,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 20,
  },
  sessionLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 20,
    marginTop: 10,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  taskTitleContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  taskTag: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  singleContainer: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default styles;
