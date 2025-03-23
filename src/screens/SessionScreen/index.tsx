import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import FlowSessionTimer from "../../components/FlowSessionTimer";
import styles from "./styles";

type SessionRouteProp = RouteProp<{ Session: { taskId: number | null; tagId: number | null; tagName: string | null; taskName: string | null } }, 'Session'>;

const SessionScreen = () => {
  const route = useRoute<SessionRouteProp>();
  const [taskId, setTaskId] = useState(route.params?.taskId ?? null);
  const [tagName, setTagName] = useState(route.params?.tagName ?? null);
  const [taskName, setTaskName] = useState(route.params?.taskName ?? null);
  const [tagId, setTagId] = useState(route.params?.tagId ?? null);

  const handleClearTask = () => {
    setTagId(null);
    setTaskId(null);
    setTagName(null);
    setTaskName(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlowSessionTimer
        taskId={taskId}
        tagId={tagId}
        tagName={tagName}
        taskName={taskName}
        onClearTask={handleClearTask}
      />
    </SafeAreaView>
  );
};

export default SessionScreen;
