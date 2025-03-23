import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "./styles";
import { useTags } from "../../hooks/useTags";
import CustomButton from "../CustomButton";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import CustomTextInput from "../CustomTextInput";

const TagSettingsForm = () => {
  const [tagInput, setTagInput] = useState("");
  const { tags, addTag, loadTags } = useTags();

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
      Start by adding a new tag
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={{ color: DefaultModeColors.text }}>New Tag:</Text>
      <CustomTextInput
        value={tagInput}
        onChangeText={setTagInput}
        placeholder="Enter new tag name"
      />
      <CustomButton title="Add Tag" onPress={handleAddTag} />
      <Text style={[styles.tagListText, { color: DefaultModeColors.text }]}>
        Tag List:
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
