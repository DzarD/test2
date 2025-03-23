import { StyleSheet } from "react-native";
import { DefaultModeColors } from "../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  separator: {
    marginVertical: 10,
    height: 2,
    width: "100%",
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  description: {
    fontSize: 16,
    flexWrap: "wrap",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#80808080",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionInput: {
    height: 200,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    columnGap:10,
  },
  flexButton: {
    flex: 1,
    width: "100%",
  },
});

export default styles;
