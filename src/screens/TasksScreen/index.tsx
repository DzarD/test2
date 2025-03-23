import React from "react";
import { SafeAreaView } from "react-native";
import styles from "./styles";
import TaskList from "../../components/TaskList";

export default function TasksScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TaskList />
    </SafeAreaView>
  );
}
