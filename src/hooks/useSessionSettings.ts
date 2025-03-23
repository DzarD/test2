import { useState, useEffect } from "react";
import { getSessionSettings, updateSessionSettings } from "../database/db";
import { DEFAULT_SESSION_SETTINGS } from "../constants";
import { SessionSettings } from "../constants/types";

export const useSessionSettings = () => {
  const [settings, setSettings] = useState<SessionSettings>(
    DEFAULT_SESSION_SETTINGS
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      const storedSettings = getSessionSettings();
      if (storedSettings) {
        setSettings(storedSettings);
      } else {
        setSettings(DEFAULT_SESSION_SETTINGS);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  const updateSettings = (newSettings: SessionSettings) => {
    updateSessionSettings(newSettings);
    setSettings(newSettings);
  };

  return { settings, loading, updateSettings };
};
