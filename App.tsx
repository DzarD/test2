import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { initDatabase } from "./src/database/db";
import { SessionSettingsProvider } from "./src/context/SessionSettingsContext";
import { DefaultModeColors, DarkModeColors } from "./src/constants";
import MenuTabNavigator from "./src/navigation/MenuTabNavigator";
import * as Notifications from "expo-notifications";
import { NotificationSettingsProvider } from "./src/context/NotificationSettingsContext";
import "./src/i18n";
import { i18nInit } from "./src/i18n";


// Import SplashScreenComponent
import SplashScreenComponent from "./src/components/SplashScreenComponent";

//set notification handler to show notifications in -> foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [loading, setLoading] = useState(true);
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize the database
        initDatabase();
        // Initialize the i18n
        await i18nInit();
        setI18nReady(true);
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initializeApp(); // Run initialization logic

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading || !i18nReady) {
    return <SplashScreenComponent />;
  }

  return (
    // Wrap with NotificationSettingsProvider
    <NotificationSettingsProvider>
      <SessionSettingsProvider>
        <NavigationContainer theme={defaultTheme}>
          {/* dark for defaultTheme and light for darkTheme */}
          <StatusBar style="dark" />
          <MenuTabNavigator />
        </NavigationContainer>
      </SessionSettingsProvider>
    </NotificationSettingsProvider>
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
