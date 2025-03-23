import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import styles from './styles';
import StatisticCharts from '../../components/StatisticCharts';

export default function StatisticsScreen() {
    return (
        <SafeAreaView style={styles.container}>
          <StatisticCharts />
        </SafeAreaView>
      );
}
