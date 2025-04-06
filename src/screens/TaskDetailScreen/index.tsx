import React, { useState } from "react";
import { Text, View, Modal } from "react-native";
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import styles from "./styles";
import { Task } from "../../constants/types";
import CustomButton from "../../components/CustomButton";
import { useTags } from "../../hooks/useTags";
import { Alert } from "react-native";
import { useTasks } from "../../hooks/useTasks";
import CustomTextInput from "../../components/CustomTextInput";
import DropDownPicker from "react-native-dropdown-picker";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import CustomCheckBox from "../../components/CustomCheckBox";
import { useTranslation } from "react-i18next";

type TaskDetailRouteProp = RouteProp<
  { TaskDetail: { task: Task } },
  "TaskDetail"
>;

const TaskDetailScreen = () => {
  const route = useRoute<TaskDetailRouteProp>();
  const navigation = useNavigation<any>();
  const { task } = route.params ?? { task: {} };
  const { tags, loadTags } = useTags();
  const { deleteTask, updateTask, updateTags } = useTasks();
  //state variables for the update modal
  const [editName, setEditName] = useState(task.name);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editTagId, setEditTagId] = useState(task.tag_id);
  const [open, setOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(task.isTaskCompleted);

  const { t } = useTranslation();

  const handleSessionScreen = () => {
    const taskId = task.id ?? 0;
    const tagId = task.tag_id ?? null; // Pass the tag ID
    const tagName = getTagNameById(tagId);
    const taskName = task.name ?? "Unnamed Task";

    console.log("Navigating to Session with:", {
      taskId,
      tagId,
      tagName,
      taskName,
    });

    navigation.reset({
      index: 0,
      routes: [
        { name: "Session", params: { taskId, tagId, tagName, taskName } },
      ],
    });
  };

  // Load tags when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTags();
    }, [])
  );

  const getTagNameById = (tagId: number | null) => {
    const tag = tags.find((tag) => tag.id === tagId);
    return tag ? tag.name : null;
  };

  const handleTaskCompletionToggle = () => {
    setIsTaskCompleted((prev: boolean) => !prev);
  };

  const handleTagSelection = (
    selectedValue: number | ((val: number | null) => number) | null
  ) => {
    // If selectedValue is a function, call it to get the actual value
    const newValue =
      typeof selectedValue === "function"
        ? selectedValue(editTagId)
        : selectedValue;

    setEditTagId(newValue === editTagId ? null : newValue);
  };

  //Handles the deletion of a task
  const handleDeleteTask = () => {
    Alert.alert(
      t("confirmDeletion"),
      t("deleteTaskConfirmation", { taskName: editName }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("ok"),
          onPress: () => {
            deleteTask(task.id);
            Alert.alert(
              t("taskDeleted"),
              t("taskDeletedMessage", { taskName: editName })
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  //handles the update of a task
  const handleUpdateTask = () => {
    setEditName(task.name);
    setEditDescription(task.description);
    setEditTagId(task.tag_id);
    setIsTaskCompleted(task.isTaskCompleted);
    setShowUpdateModal(true);
  };

  //Confirms the update of a task
  const confirmUpdate = () => {
    if (!editName.trim()) {
      // Show validation error if task name is empty
      Alert.alert(t("validationError"), t("taskNameRequired"));
    } else {
      if (editTagId !== task.tag_id) {
        updateTags(task.id, editTagId);
      }

      updateTask(
        task.id,
        editTagId,
        editName,
        editDescription,
        isTaskCompleted
      );

      Alert.alert(
        t("taskUpdated"),
        t("taskUpdatedMessage", { taskName: editName })
      );
      setShowUpdateModal(false);
      navigation.goBack();
    }
  };

  const tagName = getTagNameById(task.tag_id);

  return (
    <View style={styles.container}>
      <View style={styles.taskItem}>
        <View style={styles.taskTitleContainer}>
          <Text style={[styles.taskTitle, { color: DefaultModeColors.text }]}>
            {task.name}
          </Text>
        </View>

        {tagName != null && (
          <Text
            style={[
              styles.taskTag,
              {
                color: DefaultModeColors.text,
                backgroundColor: DefaultModeColors.border,
              },
            ]}
          >
            {tagName}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.separator,
          { backgroundColor: DefaultModeColors.border },
        ]}
      />

      <View style={styles.descriptionContainer}>
        <Text style={[styles.description, { color: DefaultModeColors.text }]}>
          {task.description}
        </Text>
        <CustomButton
          title={t("viewTaskStatistics")}
          onPress={() =>
            navigation.navigate("TaskStatistics", { taskId: task.id })
          }
        />
      </View>

      <CustomButton
        title={t("startFlowSession")}
        onPress={handleSessionScreen}
      />
      <View style={styles.buttonRow}>
        <View style={styles.flexButton}>
          <CustomButton title={t("updateTask")} onPress={handleUpdateTask} />
        </View>
        <View style={styles.flexButton}>
          <CustomButton title={t("deleteTask")} onPress={handleDeleteTask} />
        </View>
      </View>

      {showUpdateModal && (
        <Modal
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowUpdateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: DefaultModeColors.background },
              ]}
            >
              <Text
                style={[styles.modalTitle, { color: DefaultModeColors.text }]}
              >
                {t("updateTask")}
              </Text>

              <Text style={{ color: DefaultModeColors.text }}>
                {t("taskName")}:
              </Text>
              <CustomTextInput
                placeholder={t("enterTaskName")}
                value={editName}
                onChangeText={setEditName}
              />

              <Text style={{ color: DefaultModeColors.text }}>
                {t("taskDescription")}:
              </Text>

              <CustomTextInput
                style={styles.descriptionInput}
                placeholder={t("enterTaskDescription")}
                value={editDescription}
                onChangeText={setEditDescription}
                multiline={true}
              />

              <Text style={{ color: DefaultModeColors.text }}>
                {t("taskTag")}:
              </Text>
              <DropDownPicker
                open={open}
                value={editTagId}
                items={tags.map((tg) => ({
                  label: tg.name,
                  value: tg.id,
                }))}
                setOpen={setOpen}
                setValue={handleTagSelection}
                placeholder={t("selectTag")}
                //"DARK" or "LIGHT"
                style={{
                  backgroundColor: DefaultModeColors.background,
                  borderColor: DefaultModeColors.border,
                  borderWidth: 2,
                  marginVertical: 10,
                }}
                textStyle={{
                  color: DefaultModeColors.text,
                }}
                dropDownContainerStyle={{
                  backgroundColor: DefaultModeColors.background,
                  borderColor: DefaultModeColors.border,
                  borderWidth: 2,
                }}
              />

              <CustomCheckBox
                label={t("taskCompleted")}
                checked={isTaskCompleted}
                onToggle={handleTaskCompletionToggle}
              />

              <View style={styles.buttonRow}>
                <CustomButton
                  title={t("cancel")}
                  onPress={() => setShowUpdateModal(false)}
                />
                <CustomButton title={t("confirm")} onPress={confirmUpdate} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default TaskDetailScreen;
