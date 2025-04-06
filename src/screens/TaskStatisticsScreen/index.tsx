import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { getTaskStatistics } from "../../database/db";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlowSessionTask } from "../../constants/types";
import styles from "./styles";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import { useTranslation } from "react-i18next";

type TaskStatisticsRouteProp = RouteProp<
  { params: { taskId: number } },
  "params"
>;

const TaskStatisticsScreen = () => {
  const route = useRoute<TaskStatisticsRouteProp>();
  const { taskId } = route.params;

  // Pie Data for Focus Time vs. Break Time pie chart
  const [pieData, setPieData] = useState([
    {
      name: "",
      time: 0,
      color: "#27AE60",
      legendFontColor: DefaultModeColors.text,
      legendFontSize: 14,
    },
    {
      name: "",
      time: 0,
      color: "#E74C3C",
      legendFontColor: DefaultModeColors.text,
      legendFontSize: 14,
    },
  ]);
  const [totalTime, setTotalTime] = useState(0);
  const [flowSessions, setFlowSessions] = useState<FlowSessionTask[]>([]);
  const [taskName, setTaskName] = useState("Task");
  const [hasData, setHasData] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    // Get task information to use in statistics display
    const fetchTaskStats = () => {
      const stats = getTaskStatistics(taskId);
      if (stats && stats.flowSessions.length > 0) {
        setHasData(true);
        const focusTimeMinutes = Math.floor(stats.totalFocusTime / 60);
        const breakTimeMinutes = Math.floor(stats.totalBreakTime / 60);
        const totalTimeMinutes = focusTimeMinutes + breakTimeMinutes;

        // Convert total focus time in minutes to percentage
        const focusPercent =
          totalTimeMinutes > 0
            ? Math.round((focusTimeMinutes / totalTimeMinutes) * 100)
            : 0;
        // Convert total break time in minutes to percentage
        const breakPercent =
          totalTimeMinutes > 0
            ? Math.round((breakTimeMinutes / totalTimeMinutes) * 100)
            : 0;

        setPieData([
          {
            name: t("percentFocusTime"),
            time: focusPercent,
            color: "#27AE60",
            legendFontColor: DefaultModeColors.text,
            legendFontSize: 14,
          },
          {
            name: t("percentBreakTime"),
            time: breakPercent,
            color: "#E74C3C",
            legendFontColor: DefaultModeColors.text,
            legendFontSize: 14,
          },
        ]);

        setTotalTime(totalTimeMinutes);

        const sessionsInMinutes = stats.flowSessions.map((session) => ({
          ...session,
          duration: Math.floor(session.duration / 60),
        }));

        setFlowSessions(sessionsInMinutes);
        setTaskName(stats.taskName);
      } else {
        setHasData(false);
      }
    };

    fetchTaskStats();
  }, [taskId]);

  return (
    <View style={styles.container}>
      {hasData ? (
        <>
          <Text style={[styles.header, { color: DefaultModeColors.text }]}>
            {t("taskStatisticsHeader", { taskName })}
          </Text>
          <PieChart
            data={pieData.map((item) => ({
              name: item.name,
              population: item.time,
              color: item.color,
              legendFontColor: item.legendFontColor,
              legendFontSize: item.legendFontSize,
            }))}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: DefaultModeColors.background,
              backgroundGradientFrom: DefaultModeColors.background,
              backgroundGradientTo: DefaultModeColors.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="5"
            absolute
          />
          <Text style={[styles.totalTime, { color: DefaultModeColors.text }]}>
            {t("totalTimeSpent", { totalTime })}
          </Text>

          <Text
            style={[styles.sessionHeader, { color: DefaultModeColors.text }]}
          >
            {t("flowSessions")}:
          </Text>
          <FlatList
            data={flowSessions}
            keyExtractor={(item) => item.flowSessionId.toString()}
            renderItem={({ item }) => {
              const sessionStart = new Date(item.date);
              const sessionEnd = new Date(
                sessionStart.getTime() + item.duration * 60 * 1000
              );

              const startDate = sessionStart.toLocaleDateString();
              const startTime = sessionStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const endDate = sessionEnd.toLocaleDateString();
              const endTime = sessionEnd.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <View
                  style={[
                    styles.sessionItem,
                    { borderBottomColor: DefaultModeColors.border },
                  ]}
                >
                  <Text style={{ color: DefaultModeColors.text }}>
                    {t("startDate", { startDate })}
                  </Text>
                  <Text style={{ color: DefaultModeColors.text }}>
                    {t("startTime", { startTime })}
                  </Text>
                  <Text style={{ color: DefaultModeColors.text }}>
                    {t("endDate", { endDate })}
                  </Text>
                  <Text style={{ color: DefaultModeColors.text }}>
                    {t("endTime", { endTime })}
                  </Text>
                  <Text style={{ color: DefaultModeColors.text }}>
                    {t("duration", { duration: item.duration })}
                  </Text>
                </View>
              );
            }}
          />
        </>
      ) : (
        <Text style={[styles.noDataText, { color: DefaultModeColors.text }]}>
          {t("noData")}
        </Text>
      )}
    </View>
  );
};

export default TaskStatisticsScreen;
