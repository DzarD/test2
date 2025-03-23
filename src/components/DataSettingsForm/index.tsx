import React from "react";
import { View, Alert } from "react-native";
import styles from "./styles";
import { useTasks } from "../../hooks/useTasks";
import CustomButton from "../CustomButton";
import { DefaultModeColors } from "../../constants";

const DataSettingsForm = () => {
  const { tasks, deleteCompletedTasks, loadTasks } = useTasks();

  // Function to handle deleting all completed tasks
  const handleDeleteCompletedTasks = async () => {
    try {
      await deleteCompletedTasks();
      loadTasks();

      Alert.alert(
        "Success",
        "Completed tasks have been deleted.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } catch (error) {
      // If there's an error during deletion
      console.error("Error deleting tasks:", error);
      Alert.alert(
        "Error",
        "There was an issue deleting the completed tasks. Please try again.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomButton title="Delete Completed Tasks" onPress={handleDeleteCompletedTasks} />
    </View>
  );
};

export default DataSettingsForm;
