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

const SessionSettingsForm = () => {
  const { settings, loading, updateSettings } = useSessionSettingsContext();
  const [localSettings, setLocalSettings] = useState(settings);

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
        label={`Focus Time: ${localSettings.focus_time} minutes`}
        value={localSettings.focus_time}
        minimumValue={SESSION_SETTINGS_RANGES.focus_time.min}
        maximumValue={SESSION_SETTINGS_RANGES.focus_time.max}
        step={1}
        onValueChange={(value) => handleSliderChange("focus_time", value)}
      />
      <CustomSlider
        label={`Short Break: ${localSettings.short_break} minutes`}
        value={localSettings.short_break}
        minimumValue={SESSION_SETTINGS_RANGES.short_break.min}
        maximumValue={SESSION_SETTINGS_RANGES.short_break.max}
        step={1}
        onValueChange={(value) => handleSliderChange("short_break", value)}
      />
      <CustomSlider
        label={`Long Break: ${localSettings.long_break} minutes`}
        value={localSettings.long_break}
        minimumValue={SESSION_SETTINGS_RANGES.long_break.min}
        maximumValue={SESSION_SETTINGS_RANGES.long_break.max}
        step={1}
        onValueChange={(value) => handleSliderChange("long_break", value)}
      />
      <CustomSlider
        label={`Sections: ${localSettings.sections}`}
        value={localSettings.sections}
        minimumValue={SESSION_SETTINGS_RANGES.sections.min}
        maximumValue={SESSION_SETTINGS_RANGES.sections.max}
        step={1}
        onValueChange={(value) => handleSliderChange("sections", value)}
      />

      <View style={styles.buttonContainer}>
        <CustomButton title="Save Settings" onPress={handleUpdateSettings} />
        <CustomButton title="Reset to Default" onPress={handleResetToDefault} />
      </View>
    </View>
  );
};

export default SessionSettingsForm;
