import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DefaultModeColors, DarkModeColors } from "../../src/constants";
import CustomTabBarButton from "../../src/components/CustomTabBarButton";

import { useTranslation } from "react-i18next";

// Import Screens and Navigations
import SessionScreen from "../../src/screens/SessionScreen";
import TaskStackNavigator from "../../src/navigation/TaskStackNavigator";
import StatisticsScreen from "../../src/screens/StatisticsScreen";
import SettingsScreen from "../../src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const MenuTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Session"
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        headerStyle: { height: Platform.OS === "ios" ? 100 : 80 },
        headerTitleStyle: {
          paddingBottom: Platform.OS === "ios" ? 5 : 0,
        },
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Session") {
            iconName = focused ? "timer-settings" : "timer-settings-outline";
          } else if (route.name === "TaskStack") {
            iconName = focused ? "clipboard-list" : "clipboard-list-outline";
          } else if (route.name === "Statistics") {
            iconName = focused ? "chart-box" : "chart-box-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "cog" : "cog-outline";
          } else {
            iconName = focused ? "triangle" : "triangle-outline"; // Default icon
          }

          return (
            <MaterialCommunityIcons
              name={iconName as any}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: DefaultModeColors.accent,
        tabBarInactiveTintColor: DefaultModeColors.text,
      })}
    >
      <Tab.Screen
        name="Session"
        component={SessionScreen}
        options={{ title: t("session") }}
      />
      <Tab.Screen
        name="TaskStack"
        component={TaskStackNavigator}
        options={{ title: t("tasks"), headerShown: false }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: t("statistics") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t("settings") }}
      />
    </Tab.Navigator>
  );
};

export default MenuTabNavigator;
