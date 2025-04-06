import React from "react";
import { View, Alert } from "react-native";
import styles from "./styles";
import { useTasks } from "../../hooks/useTasks";
import CustomButton from "../CustomButton";
import { deleteAllUserData } from "../../database/db";
import { useTags } from "../../hooks/useTags";
import { useTranslation } from "react-i18next";

const DataSettingsForm = () => {
  const { tasks, deleteCompletedTasks, loadTasks } = useTasks();
  const { loadTags } = useTags();

  const { t } = useTranslation();

  // Function to handle deleting all completed tasks
  const handleDeleteCompletedTasks = async () => {
    Alert.alert(
      t("confirmDeletion"),
      t("deleteTasksConfirmationMessage"),
      [
        {
          text: t("cancel")
        },
        {
          text: t("delete"),
          onPress: async () => {
            try {
              await deleteCompletedTasks();
              loadTasks();

              Alert.alert(
                t("success"),
                t("deleteTasksSuccessMessage"),
                [{ text: t("ok") }],
                { cancelable: false }
              );
            } catch (error) {
              // If there's an error during deletion
              console.error("Error deleting tasks:", error);
              Alert.alert(
                t("error"),
                t("deleteTasksErrorMessage"),
                [{ text: t("ok") }],
                { cancelable: false }
              );
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

   // Function to handle deleting all user data
   const handleDeleteAllUserData = () => {
    Alert.alert(
      t("confirmDeletion"),
      t("deleteUserDataConfirmationMessage"),
      [
        {
          text: t("cancel")
        },
        {
          text: t("deleteAllData"),
          onPress: async () => {
            try {
              // Call the function to delete all user data
              await deleteAllUserData(); 

              loadTags();
              Alert.alert(
                t("success"),
                t("deleteUserDataSuccessMessage"),
                [{ text: t("ok") }],
                { cancelable: false }
              );
            } catch (error) {
              console.error("Error deleting all user data:", error);
              Alert.alert(
                t("error"),
                t("deleteUserDataErrorMessage"),
                [{ text: t("ok") }],
                { cancelable: false }
              );
            }
          }
        }
      ],
      { cancelable: false }
    );
  };


  return (
    <View style={styles.container}>
      <CustomButton title={t("deleteCompletedTasks")} onPress={handleDeleteCompletedTasks} />
      <CustomButton title={t("deleteAllUserData")} onPress={handleDeleteAllUserData}/>
    </View>
  );
};

export default DataSettingsForm;
