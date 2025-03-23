import React, { useEffect, useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useTags } from "../../hooks/useTags";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { DefaultModeColors } from "../../constants";
import { Task } from "../../constants/types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

const TaskList = () => {
  const { tasks, loading, loadTasks } = useTasks();
  const { tags, loadTags } = useTags();
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  const navigation = useNavigation<any>();

  // Load tags when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTags();
    }, [])
  );

  // Load tasks when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  // Handle adding a new task
  const handleAddTask = () => {
    navigation.navigate("AddTask");
  };

  const ItemSeparator = () => (
    <View
      style={[styles.separator, { backgroundColor: DefaultModeColors.border }]}
    />
  );

  const ListEmpty = () => (
    <Text style={[styles.noTaskText, { color: DefaultModeColors.text }]}>
      Start by adding a new task
    </Text>
  );
  const ListFooter = () => (
    <View
      style={[
        styles.separator,
        { backgroundColor: DefaultModeColors.border, marginBottom: 80 },
      ]}
    />
  );

  const getTagNameById = (tagId: number | null) => {
    const tag = tags.find((tag) => tag.id === tagId);
    return tag ? tag.name : null;
  };

  const renderItem = ({ item }: { item: Task }) => {
    const tagName = getTagNameById(item.tag_id);

    const handleTaskPress = () => {
      // Navigate to the TaskDetail screen and pass the task data
      navigation.navigate("TaskDetail", { task: item });
    };

    return (
      <TouchableOpacity style={styles.taskItem} onPress={handleTaskPress}>
        <View style={styles.taskTitleContainer}>
          <Text style={[styles.taskTitle, { color: DefaultModeColors.text }]}>
            {item.name}
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
      </TouchableOpacity>
    );
  };

  const filterTasksByTags = (tagIds: number[]) => {
    if (tagIds.length === 0) {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(
        (task) => task.tag_id !== null && tagIds.includes(task.tag_id)
      );
      setFilteredTasks(filtered);
    }
  };

  useEffect(() => {
    filterTasksByTags(selectedTags);
  }, [selectedTags, tasks]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        items={tags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }))}
        multiple={true}
        min={0}
        max={tags.length}
        value={selectedTags}
        setValue={setSelectedTags}
        placeholder="Filter by Tag"
        mode="BADGE"
        showBadgeDot={false}
        theme="LIGHT"
        style={{
          backgroundColor: DefaultModeColors.background,
          borderColor: DefaultModeColors.border,
          borderWidth: 2,
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

      {selectedTags.length === 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
        />
      ) : filteredTasks.length === 0 ? (
        <Text style={[styles.noTaskText, { color: DefaultModeColors.text }]}>
          No tasks found for the selected tags.
        </Text>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: DefaultModeColors.accent }]}
        onPress={handleAddTask}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskList;
