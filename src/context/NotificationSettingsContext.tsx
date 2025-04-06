import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import * as Notifications from "expo-notifications";
import { getUserPreference, setUserPreference } from "../database/db";

interface NotificationSettingsContextValue {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const NotificationSettingsContext = createContext<
  NotificationSettingsContextValue | undefined
>(undefined);

export const NotificationSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // [ADDED] When toggling on, request permission from the OS
  //Load saved push notification selection
  useEffect(() => {
    try {
      const stored = getUserPreference("notificationsEnabled");
      if (stored === "true") {
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error("Error loading notification preference:", error);
    }
  }, []);

  // request permission from the OS
  const handleSetNotificationsEnabled = async (enabled: boolean) => {
    if (enabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permission not granted.");
        setNotificationsEnabled(false);
        try {
          setUserPreference("notificationsEnabled", "false");
        } catch (error) {
          console.error("Error saving notification preference:", error);
        }
        return;
      }
    }
    setNotificationsEnabled(enabled);
    try {
      setUserPreference("notificationsEnabled", enabled ? "true" : "false");
    } catch (error) {
      console.error("Error saving notification preference:", error);
    }
  };

  return (
    <NotificationSettingsContext.Provider
      value={{
        notificationsEnabled,
        setNotificationsEnabled: handleSetNotificationsEnabled,
      }}
    >
      {children}
    </NotificationSettingsContext.Provider>
  );
};

export const useNotificationSettings = () => {
  const context = useContext(NotificationSettingsContext);
  if (!context) {
    throw new Error("useNotificationSettings Error");
    throw new Error("useNotificationSettings Error");
  }
  return context;
};
