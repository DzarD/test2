import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TasksScreen from "../screens/TasksScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import SessionScreen from "../screens/SessionScreen";
import { DefaultModeColors } from "../constants";
import TaskStatisticsScreen from "../screens/TaskStatisticsScreen";

const Stack = createNativeStackNavigator();

const TaskStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tasks"
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: DefaultModeColors.text,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="Tasks" component={TasksScreen} />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ title: "Add Task" }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: "Task Detail" }}
      />
      <Stack.Screen
        name="SessionScreen"
        component={SessionScreen}
        options={{ title: "Session" }}
      />
      <Stack.Screen
      name="Task Statistics"
      component={TaskStatisticsScreen}
      />
    </Stack.Navigator>
  );
};

export default TaskStackNavigator;
