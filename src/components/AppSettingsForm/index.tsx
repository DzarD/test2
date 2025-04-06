import React, { useState } from "react";
import { View, Text } from "react-native";
import { useNotificationSettings } from "../../context/NotificationSettingsContext";
import CustomCheckBox from "../CustomCheckBox";
import styles from "./styles";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import DropDownPicker from "react-native-dropdown-picker";
import i18n, { supportedLanguages, changeLanguage } from "../../i18n";
import { useTranslation } from "react-i18next";

const AppSettingsForm = () => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  const { t } = useTranslation();

  const { notificationsEnabled, setNotificationsEnabled } =
    useNotificationSettings();

  // Toggle notifications by inverting current state
  const handleToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLanguageSelection = (
    selectedValue: string | ((val: string) => string)
  ) => {
    // If selectedValue is a function, call it to get the actual value
    const newValue =
      typeof selectedValue === "function"
        ? selectedValue(language)
        : selectedValue;

    changeLanguage(newValue);
    setLanguage(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkBoxContainer}>
        <Text style={[styles.label, { color: DefaultModeColors.text }]}>
          {t("pushNotifications")}
        </Text>
        <CustomCheckBox
          label="" // If you want the label inside the checkbox, add text here.
          checked={notificationsEnabled}
          onToggle={handleToggle}
        />
      </View>
      <Text style={{ color: DefaultModeColors.text }}>{t("language")}:</Text>
      <DropDownPicker
        open={open}
        value={language}
        items={supportedLanguages}
        setOpen={setOpen}
        setValue={handleLanguageSelection}
        closeAfterSelecting={true}
        placeholder={t("selectLanguage")}
        //"DARK" or "LIGHT"
        theme="LIGHT"
        style={{
          backgroundColor: DefaultModeColors.background,
          borderColor: DefaultModeColors.border,
          borderWidth: 2,
        }}
        textStyle={{
          color: DefaultModeColors.text,
        }}
        dropDownContainerStyle={{
          backgroundColor: DefaultModeColors.background,
          borderColor: DefaultModeColors.border,
          borderWidth: 2,
        }}
      />
    </View>
  );
};

export default AppSettingsForm;
