import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getSessionsData } from "../../database/db";
import { SessionData } from "../../constants/types";
import { startOfDay, endOfDay, subDays } from "date-fns";
import styles from "./styles";
import {
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomButton from "../CustomButton";
import { DefaultModeColors, DarkModeColors } from "../../constants";
import { LineChart, PieChart } from "react-native-chart-kit";

const StatisticCharts = () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"day" | "week">("day");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [lineChartData, setLineChartData] = useState<{
    labels: string[];
    focusData: number[];
    breakData: number[];
  }>({
    labels: [],
    focusData: [],
    breakData: [],
  });

  const [pieChartData, setPieChartData] = useState<
    {
      name: string;
      population: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }[]
  >([]);


  useEffect(() => {
    setInterval();
  }, [mode]);

  useEffect(() => {
    loadSessionsData(startDate.toISOString(), endDate.toISOString());
  }, [startDate, endDate]);

  // Reload data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSessionsData(startDate.toISOString(), endDate.toISOString());
    }, [startDate, endDate])
  );

  const setInterval = () => {
    const currentDate = new Date();
    setEndDate(endOfDay(currentDate));
    setStartDate(
      mode === "day"
        ? startOfDay(currentDate)
        : startOfDay(subDays(currentDate, 7))
    );
  };

  const loadSessionsData = (startDate: string, endDate: string) => {
    setLoading(true);
    setLineChartData({
      labels: [],
      focusData: [],
      breakData: [],
    });

    const storedSessionsData = getSessionsData(startDate, endDate);
    if (!storedSessionsData || storedSessionsData.length === 0) {
      setLineChartData({ labels: [], focusData: [], breakData: [] });
      setPieChartData([]);
      setLoading(false);
      return;
    }

    if (mode === "day") {
      processDayData(storedSessionsData);
    } else {
      processWeekData(storedSessionsData);
    }
    processTagData(storedSessionsData);

    setLoading(false);
  };

  const processDayData = (sessions: SessionData[]) => {
    const labels: string[] = [];
    const hourlyFocus: { [key: number]: number } = {};
    const hourlyBreak: { [key: number]: number } = {};

    // Create labels and initialize hourly data
    for (let i = 0; i < 24; i++) {
      labels.push(i.toString());
      hourlyFocus[i] = 0;
      hourlyBreak[i] = 0;
    }

    // Process session data
    sessions.forEach((session) => {
      let start = new Date(session.start_time);
      let end = new Date(session.end_time);

      // Cap the end time to the provided endDate if it goes beyond it
      if (end > endDate) {
        end = endDate;
      }

      // Loop through each hour the session spans
      while (start < end) {
        const hour = start.getHours(); // Get the current hour of the session
        const nextHour = new Date(start);
        nextHour.setHours(hour + 1, 0, 0, 0); // Get the next hour boundary

        let minutesInThisHour = Math.min(
          (end.getTime() - start.getTime()) / 60000, // Minutes left in the session
          (nextHour.getTime() - start.getTime()) / 60000 // Minutes until the next hour
        );

        // Assign minutes to the correct session type
        if (session.type === "Focus") {
          hourlyFocus[hour] += minutesInThisHour;
        } else {
          hourlyBreak[hour] += minutesInThisHour;
        }

        // Move the start time forward by the added minutes
        start = new Date(start.getTime() + minutesInThisHour * 60000);
      }
    });

    // Update state with the processed data
    setLineChartData({
      labels,
      focusData: Object.values(hourlyFocus),
      breakData: Object.values(hourlyBreak),
    });
  };

  const processWeekData = (sessions: SessionData[]) => {
    const labels: string[] = [];
    const dailyFocus: { [key: number]: number } = {};
    const dailyBreak: { [key: number]: number } = {};

    // Create labels and initialize daily data
    for (let i = 0; i < 8; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      labels.push(currentDay.getDate().toString());
      dailyFocus[i] = 0;
      dailyBreak[i] = 0;
    }

    // Process session data
    sessions.forEach((session) => {
      let start = new Date(session.start_time);
      let end = new Date(session.end_time);

      // Cap the end time if it exceeds the provided endDate
      if (end > endDate) {
        end = endDate;
      }

      // Loop through each day the session spans
      while (start < end) {
        // Get the current day index
        const dayIndex = Math.floor(
          (start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Calculate minutes for the current day
        const nextMidnight = new Date(start);
        nextMidnight.setHours(23, 59, 59, 999); // End of the current day

        let minutesToAdd = Math.min(
          (end.getTime() - start.getTime()) / 60000, // Total minutes remaining
          (nextMidnight.getTime() - start.getTime()) / 60000 // Minutes until midnight
        );

        // Assign minutes to the correct session type
        if (session.type === "Focus") {
          dailyFocus[dayIndex] += minutesToAdd;
        } else {
          dailyBreak[dayIndex] += minutesToAdd;
        }

        // Move start time to the next day
        start = new Date(nextMidnight.getTime() + 1);
      }
    });

    // Update state with the processed data
    setLineChartData({
      labels,
      focusData: Object.values(dailyFocus),
      breakData: Object.values(dailyBreak),
    });
  };

  const processTagData = (sessions: SessionData[]) => {
    const tagFocus: { [key: string]: number } = {};

    // Process session data
    sessions.forEach((session) => {
      let start = new Date(session.start_time);
      let end = new Date(session.end_time);

      // Cap the end time to the provided endDate
      if (end > endDate) {
        end = endDate;
      }

      const minutes = (end.getTime() - start.getTime()) / 60000; // Convert to minutes

      if (session.type === "Focus") {
        tagFocus[session.tag] = (tagFocus[session.tag] || 0) + minutes;
      }
    });

    // Sort tags by focus time
    const sortedTagEntries = Object.entries(tagFocus).sort(
      (a, b) => b[1] - a[1]
    );

    // Convert to PieChart format
    const pieData = sortedTagEntries.map(([tag, minutes], index) => ({
      name: `${tag}`,
      population: minutes,
      color: getRandomColor(index),
      legendFontColor: DefaultModeColors.text,
      legendFontSize: 12,
    }));

    // Update state with the processed data
    setPieChartData(pieData);
  };


  const getRandomColor = (index: number) => {
    const colors = [
      "#9B59B6",
      "#2980B9",
      "#F39C12",
      "#2ECC71",
      "#E74C3C",
      "#34495E",
      "#16A085",
      "#F1C40F",
      "#E67E22",
      "#D35400",
      "#1ABC9C",
      "#8E44AD",
      "#7F8C8D",
      "#2C3E50",
      "#F4D03F",
      "#A3E4D7",
      "#5DADE2",
      "#D5DBDB",
      "#B3B6B7",
      "#16A085",
    ];
    return colors[index % colors.length]; // Cycle through 20 colors
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Today"
          viewStyle={[
            styles.button,
            {
              backgroundColor: DefaultModeColors.background,
              borderColor:
                mode === "day"
                  ? DefaultModeColors.accent
                  : DefaultModeColors.border,
            },
          ]}
          textStyle={{ color: DefaultModeColors.text }}
          onPress={() => setMode("day")}
        />
        <CustomButton
          title="Week"
          viewStyle={[
            styles.button,
            {
              backgroundColor: DefaultModeColors.background,
              borderColor:
                mode === "week"
                  ? DefaultModeColors.accent
                  : DefaultModeColors.border,
            },
          ]}
          textStyle={{ color: DefaultModeColors.text }}
          onPress={() => setMode("week")}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={DefaultModeColors.border} />
      ) : lineChartData.focusData.length === 0 || pieChartData.length === 0 ? (
        <Text style={[styles.noDataText, { color: DefaultModeColors.text }]}>
          No data available
        </Text>
      ) : (
        <>
          <ScrollView horizontal={true}>
            <LineChart
              data={{
                labels: lineChartData.labels,
                datasets: [
                  {
                    data: lineChartData.focusData, // Focus time
                    color: () => "#27AE60",
                    strokeWidth: 2,
                  },
                  {
                    data: lineChartData.breakData, // Break time
                    color: () => "#E74C3C",
                    strokeWidth: 2,
                  },
                ],
                legend: ["Focus Time", "Break Time"],
              }}
              width={mode === "day" ? 600 : Dimensions.get("window").width - 40}
              height={250}
              yAxisSuffix="min"
              chartConfig={{
                backgroundGradientFrom: DefaultModeColors.background,
                backgroundGradientTo: DefaultModeColors.background,
                decimalPlaces: 1,
                color: (opacity) => DefaultModeColors.text,
                labelColor: (opacity) => DefaultModeColors.text,
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  strokeDasharray: 0,
                  stroke: DefaultModeColors.border,
                },
              }}
              bezier
              style={{ marginVertical: 10, borderRadius: 10 }}
            />
          </ScrollView>
          <PieChart
            data={pieChartData}
            width={Dimensions.get("window").width - 40}
            height={250}
            chartConfig={{
              color: () => DefaultModeColors.text,
            }}
            accessor="population"
            backgroundColor={DefaultModeColors.background}
            paddingLeft="15"
          />  
        </>
      )}
    </View>
  );
};

export default StatisticCharts;
