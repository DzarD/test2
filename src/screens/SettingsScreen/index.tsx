import React from "react";
import { View, Text, SafeAreaView, SectionList } from "react-native";
import styles from "./styles";
import SessionSettingsForm from "../../components/SessionSettingsForm";
import TagSettingsForm from "../../components/TagSettingsForm";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import DataSettingsForm from "../../components/DataSettingsForm";

export default function SettingsScreen() {
  const sections = [
    {
      title: "Session Settings",
      data: [<SessionSettingsForm />],
    },
    {
      title: "Tag Settings",
      data: [<TagSettingsForm />],
    },
    {
      title: "Data Settings",
      data: [<DataSettingsForm />],
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
