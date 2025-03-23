import React, { createContext, useContext, ReactNode } from "react";
import { useSessionSettings } from "../hooks/useSessionSettings";
import { SessionSettings } from "../constants/types";

interface SessionSettingsContextProps {
  settings: SessionSettings;
  loading: boolean;
  updateSettings: (newSettings: SessionSettings) => void;
}

const SessionSettingsContext = createContext<
  SessionSettingsContextProps | undefined
>(undefined);

export const useSessionSettingsContext = () => {
  const context = useContext(SessionSettingsContext);
  if (!context) {
    throw new Error(
      "useSessionSettingsContext must be used within a SessionSettingsProvider"
    );
  }
  return context;
};

interface SessionSettingsProviderProps {
  children: ReactNode;
}

export const SessionSettingsProvider: React.FC<
  SessionSettingsProviderProps
> = ({ children }) => {
  const { settings, loading, updateSettings } = useSessionSettings();

  return (
    <SessionSettingsContext.Provider
      value={{ settings, loading, updateSettings }}
    >
      {children}
    </SessionSettingsContext.Provider>
  );
};
