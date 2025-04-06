import React from "react";
import { View, Text, SafeAreaView, SectionList } from "react-native";
import styles from "./styles";
import SessionSettingsForm from "../../components/SessionSettingsForm";
import TagSettingsForm from "../../components/TagSettingsForm";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import DataSettingsForm from "../../components/DataSettingsForm";
import AppSettingsForm from "../../components/AppSettingsForm";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("appSettings"),
      data: [<AppSettingsForm key="app" />],
    },
    {
      title: t("dataSettings"),
      data: [<DataSettingsForm key="data" />],
    },
    {
      title: t("sessionSettings"),
      data: [<SessionSettingsForm key="session" />],
    },
    {
      title: t("tagSettings"),
      data: [<TagSettingsForm key="tags" />],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>{item}</View>
        )}
        renderSectionHeader={({ section }) => (
          <Text
            style={[
              styles.headerText,
              {
                color: DefaultModeColors.text,
                backgroundColor: DefaultModeColors.background,
                borderBottomColor: DefaultModeColors.border,
              },
            ]}
          >
            {section.title}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
      />
    </SafeAreaView>
  );
}
