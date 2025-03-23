import { View, Text } from "react-native";
import { useTimer } from "../../hooks/useTimer";
import styles from "./styles";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSessionSettingsContext } from "../../context/SessionSettingsContext";
import CustomButton from "../CustomButton";
import DropDownPicker from "react-native-dropdown-picker";
import { useTags } from "../../hooks/useTags";
import { DefaultModeColors, DarkModeColors } from "../../constants";

interface FlowSessionTimerProps {
  taskId: number | null;
  tagId: number | null;
  tagName: string | null;
  taskName: string | null;
  onClearTask?: () => void;
}

const FlowSessionTimer: React.FC<FlowSessionTimerProps> = ({
  taskId,
  tagId: passedTagId,
  tagName,
  taskName,
  onClearTask,
}) => {
  const initialFlowSessionId = 1;
  const { settings, loading } = useSessionSettingsContext();
  const [localSettings, setLocalSettings] = useState(settings);

  const [open, setOpen] = useState(false);
  const [tagId, setTagId] = useState<number | null>(null);
  const { tags, loadTags } = useTags();

  const {
    timeLeft,
    isActive,
    startStopTimer,
    sessionLabel,
    skipBreak,
    currentSession,
  } = useTimer(localSettings, 1, initialFlowSessionId, tagId, taskId);

  useEffect(() => {
    if (passedTagId !== null) {
      console.log("Updating tagId from SessionScreen:", passedTagId);
      setTagId(passedTagId);
    }
  }, [passedTagId]);

  useFocusEffect(
    React.useCallback(() => {
      if (settings) {
        setLocalSettings(settings);
      }
    }, [settings])
  );

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  useFocusEffect(
    React.useCallback(() => {
      loadTags();
    }, [])
  );

  const handleTagSelection = (
    selectedValue: number | ((val: number | null) => number) | null
  ) => {
    // If selectedValue is a function, call it to get the actual value
    const newValue =
      typeof selectedValue === "function"
        ? selectedValue(tagId)
        : selectedValue;

    setTagId(newValue === tagId ? null : newValue);
  };

  const handleClearTask = () => {
    setTagId(null);
    if (onClearTask) onClearTask();
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        {!isActive && taskId == null && tags.length > 0 && (
          <DropDownPicker
            open={open}
            value={tagId}
            items={tags.map((tag) => ({
              label: tag.name,
              value: tag.id,
            }))}
            setOpen={setOpen}
            setValue={handleTagSelection}
            closeAfterSelecting={true}
            placeholder="Select a tag"
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
        )}
        <View style={styles.taskItem}>
          <View style={styles.taskTitleContainer}>
            {taskId != null && (
              <Text
                style={[styles.taskTitle, { color: DefaultModeColors.text }]}
              >
                {taskName}
              </Text>
            )}
          </View>

          {isActive && tagId != null && (
            <Text
              style={[
                styles.taskTag,
                {
                  color: DefaultModeColors.text,
                  backgroundColor: DefaultModeColors.border,
                },
              ]}
            >
              {tags.find((tag) => tag.id === tagId)?.name}
            </Text>
          )}

          {!isActive && tagName != null && tagId != null && (
            <Text
              style={[
                styles.taskTag,
                {
                  color: DefaultModeColors.text,
                  backgroundColor: DefaultModeColors.border,
                },
              ]}
            >
              {tags.find((tag) => tag.id === tagId)?.name}
            </Text>
          )}
        </View>
        {!isActive && taskId != null && (
          <>
            <View style={styles.singleContainer}>
              <CustomButton title="Clear Task" onPress={handleClearTask} />
            </View>
          </>
        )}
      </View>

      <View style={styles.timerContainer}>
        <Text style={[styles.sessionLabel, { color: DefaultModeColors.text }]}>
          {sessionLabel}
        </Text>
        <Text style={[styles.time, { color: DefaultModeColors.accent }]}>
          {`${Math.floor(timeLeft / 60000)}:${Math.floor(
            (timeLeft % 60000) / 1000
          )
            .toString()
            .padStart(2, "0")}`}
        </Text>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={isActive ? "Stop" : "Start"}
            onPress={startStopTimer}
          />
          {isActive && currentSession % 2 === 0 && (
            <CustomButton title="Skip Break" onPress={skipBreak} />
          )}
        </View>
      </View>
    </View>
  );
};

export default FlowSessionTimer;
