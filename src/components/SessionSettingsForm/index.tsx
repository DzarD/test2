import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import {
  SESSION_SETTINGS_RANGES,
  DEFAULT_SESSION_SETTINGS,
} from "../../constants";
import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { useSessionSettingsContext } from "../../context/SessionSettingsContext";
import CustomButton from "../CustomButton";
import CustomSlider from "../CustomSlider";
import { useTranslation } from "react-i18next";

const SessionSettingsForm = () => {
  const { settings, loading, updateSettings } = useSessionSettingsContext();
  const [localSettings, setLocalSettings] = useState(settings);

  const { t } = useTranslation();

  // Update local tempSettings whenever settings are changed in the sliders
  const handleSliderChange = (key: string, value: number) => {
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleUpdateSettings = () => {
    updateSettings(localSettings);
  };

  const handleResetToDefault = () => {
    setLocalSettings(DEFAULT_SESSION_SETTINGS);
    updateSettings(DEFAULT_SESSION_SETTINGS);
  };

  // Reset local settings when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (settings) {
        setLocalSettings(settings);
      }
    }, [settings])
  );

  // Reset local settings when the component mounts or settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <CustomSlider
        label={t("focusTime", { minutes: localSettings.focus_time })}
        value={localSettings.focus_time}
        minimumValue={SESSION_SETTINGS_RANGES.focus_time.min}
        maximumValue={SESSION_SETTINGS_RANGES.focus_time.max}
        step={1}
        onValueChange={(value) => handleSliderChange("focus_time", value)}
      />
      <CustomSlider
        label={t("shortBreak", { minutes: localSettings.short_break })}
        value={localSettings.short_break}
        minimumValue={SESSION_SETTINGS_RANGES.short_break.min}
        maximumValue={SESSION_SETTINGS_RANGES.short_break.max}
        step={1}
        onValueChange={(value) => handleSliderChange("short_break", value)}
      />
      <CustomSlider
        label={t("longBreak", { minutes: localSettings.long_break })}
        value={localSettings.long_break}
        minimumValue={SESSION_SETTINGS_RANGES.long_break.min}
        maximumValue={SESSION_SETTINGS_RANGES.long_break.max}
        step={1}
        onValueChange={(value) => handleSliderChange("long_break", value)}
      />
      <CustomSlider
        label={t("sections", { count: localSettings.sections })}
        value={localSettings.sections}
        minimumValue={SESSION_SETTINGS_RANGES.sections.min}
        maximumValue={SESSION_SETTINGS_RANGES.sections.max}
        step={1}
        onValueChange={(value) => handleSliderChange("sections", value)}
      />

      <View style={styles.buttonContainer}>
        <CustomButton title={t("save")} onPress={handleUpdateSettings} />
        <CustomButton title={t("reset")} onPress={handleResetToDefault} />
      </View>
    </View>
  );
};

export default SessionSettingsForm;
