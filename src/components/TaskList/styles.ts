import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  taskItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 8,
  },
  taskTitleContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  noTaskText: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 10,
  },
  separator: {
    height: 2,
    width: "100%",
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
  },
  fabText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },
});

export default styles;
