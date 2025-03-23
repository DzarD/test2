import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderRadius: 10,
    borderWidth: 2,
    paddingLeft: 5,
    marginVertical: 10,
    padding: 10,
  },
  tag: {
    fontSize: 16,
    padding: 5,
  },
  tagListText: {
    marginVertical: 10,
  },
  noTagsText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
  },
  separator: {
    height: 2,
    width: "100%",
  },
});

export default styles;
