import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./styles";
import { useTags } from "../../hooks/useTags";
import CustomButton from "../CustomButton";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import CustomTextInput from "../CustomTextInput";
import { useTranslation } from "react-i18next";

const TagSettingsForm = () => {
  const [tagInput, setTagInput] = useState("");
  const { tags, addTag, loadTags } = useTags();

  const { t } = useTranslation();

  // Function to handle adding a new tag to tag table
  const handleAddTag = async () => {
    if (tagInput.trim()) {
      await addTag(tagInput.trim());
      setTagInput("");
      loadTags();
    }
  };

  const ItemSeparator = () => (
    <View
      style={[styles.separator, { backgroundColor: DefaultModeColors.border }]}
    />
  );

  const ListEmpty = () => (
    <Text style={[styles.noTagsText, { color: DefaultModeColors.text }]}>
      {t("startAddingTag")}
    </Text>
  );

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return (
    <View style={styles.container}>
      <Text style={{ color: DefaultModeColors.text }}>{t("newTag")}:</Text>
      <CustomTextInput
        value={tagInput}
        onChangeText={setTagInput}
        placeholder={t("enterTagName")}
      />
      <CustomButton title={t("addTag")} onPress={handleAddTag} />
      <Text style={[styles.tagListText, { color: DefaultModeColors.text }]}>
      {t("tagList")}:
      </Text>
      <FlatList
        data={tags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={[styles.tag, { color: DefaultModeColors.text }]}>
            {item.name}
          </Text>
        )}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={ListEmpty}
      />
    </View>
  );
};
export default TagSettingsForm;
