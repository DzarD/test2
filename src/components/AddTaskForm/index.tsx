import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import styles from "./styles";
import CustomButton from "../CustomButton";
import CustomTextInput from "../CustomTextInput";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import { useTasks } from "../../hooks/useTasks";
import { useTags } from "../../hooks/useTags";
import DropDownPicker from "react-native-dropdown-picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function AddTaskForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [open, setOpen] = useState(false);
  const [tagId, setTagId] = useState<number | null>(null);
  const { tags, loadTags } = useTags();

  const { addTask } = useTasks();

  const navigation = useNavigation();

  // Load tags when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTags();
    }, [])
  );

  const handleTagSelection = (
    selectedValue: number | ((val: number | null) => number) | null
  ) => {
    // If selectedValue is a function, call it to get the actual value
    const newValue =
      typeof selectedValue === "function"
        ? selectedValue(tagId)
        : selectedValue;

    setTagId(newValue === tagId ? null : newValue);
  };

  const handleAddTask = () => {
    if (!name.trim()) {
      // Show validation error if task name is empty
      Alert.alert("Validation Error", "Task name is required");
    } else {
      // Add task
      addTask(tagId, name, description);
      // Navigate back after adding the task
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: DefaultModeColors.text }}>Task Name:</Text>
      <CustomTextInput
        placeholder="Enter task name"
        value={name}
        onChangeText={setName}
      />

      <Text style={{ color: DefaultModeColors.text }}>Task Description:</Text>
      <CustomTextInput
        style={styles.descriptionInput}
        placeholder="Enter task description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      <Text style={{ color: DefaultModeColors.text }}>Task Tag:</Text>
      <DropDownPicker
        open={open}
        value={tagId}
        items={tags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }))}
        setOpen={setOpen}
        setValue={handleTagSelection}
        closeAfterSelecting={true}
        placeholder="Select a tag"
        //"DARK" or "LIGHT"
        theme="LIGHT"
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

      <CustomButton title="Add Task" onPress={handleAddTask} />
    </View>
  );
}
