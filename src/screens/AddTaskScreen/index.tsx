import React from "react";
import { SafeAreaView } from "react-native";
import styles from "./styles";
import AddTaskForm from "../../components/AddTaskForm";

export default function AddTaskScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AddTaskForm />
    </SafeAreaView>
  );
}
