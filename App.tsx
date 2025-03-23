import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { Text, Platform } from "react-native";
import { initDatabase } from "./src/database/db";
import { SessionSettingsProvider } from "./src/context/SessionSettingsContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DefaultModeColors, DarkModeColors } from "./src/constants";
import CustomTabBarButton from "./src/components/CustomTabBarButton";

// Import Screens and Navigations
import SessionScreen from "./src/screens/SessionScreen";
import TaskStackNavigator from "./src/navigation/TaskStackNavigator";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

// Prevent auto hide of the splash screen
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize database on app start
    initDatabase();
    setLoading(false);
    // Hide splash screen
    SplashScreen.hideAsync();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SessionSettingsProvider>
      <NavigationContainer theme={defaultTheme}>
        {/* dark for defaultTheme and light for darkTheme */}
        <StatusBar style="dark" />
        <Tab.Navigator
          initialRouteName="Session"
          screenOptions={({ route }) => ({
            headerTitleAlign: "center",
            headerStyle: { height: Platform.OS === "ios" ? 100 : 80 },
            headerTitleStyle: { paddingBottom: Platform.OS === "ios" ? 5 : 0 },
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              if (route.name === "Session") {
                iconName = focused
                  ? "timer-settings"
                  : "timer-settings-outline";
              } else if (route.name === "TaskStack") {
                iconName = focused
                  ? "clipboard-list"
                  : "clipboard-list-outline";
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
          <Tab.Screen name="Session" component={SessionScreen} />
          <Tab.Screen
            name="TaskStack"
            component={TaskStackNavigator}
            options={{ title: "Tasks", headerShown: false }}
          />
          <Tab.Screen name="Statistics" component={StatisticsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SessionSettingsProvider>
  );
}

// Themes for Navigation
const defaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: DefaultModeColors.background,
    text: DefaultModeColors.text,
    border: DefaultModeColors.border,
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: DarkModeColors.background,
    text: DarkModeColors.text,
    border: DarkModeColors.border,
  },
};
