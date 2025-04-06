import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TasksScreen from "../screens/TasksScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import SessionScreen from "../screens/SessionScreen";
import { DefaultModeColors } from "../constants";
import TaskStatisticsScreen from "../screens/TaskStatisticsScreen";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();

const TaskStackNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="Tasks"
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: DefaultModeColors.text,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ title: t("tasks") }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ title: t("addTask") }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: t("taskDetail") }}
      />
      <Stack.Screen
        name="SessionScreen"
        component={SessionScreen}
        options={{ title: t("session") }}
      />
      <Stack.Screen
        name="TaskStatistics"
        component={TaskStatisticsScreen}
        options={{ title: t("taskStatistics") }}
      />
    </Stack.Navigator>
  );
};

export default TaskStackNavigator;
