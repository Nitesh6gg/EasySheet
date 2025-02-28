import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  // Disable touch events on web to prevent warnings
  propsForDots: Platform.select({
    web: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
    default: {
      r: 6,
      strokeWidth: 2,
      stroke: '#007AFF',
    },
  }),
};

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('week');

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  const profitData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.timeframeButtons}>
          <Pressable
            style={[
              styles.timeframeButton,
              timeframe === 'week' && styles.timeframeButtonActive,
            ]}
            onPress={() => setTimeframe('week')}>
            <Text
              style={[
                styles.timeframeButtonText,
                timeframe === 'week' && styles.timeframeButtonTextActive,
              ]}>
              Week
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.timeframeButton,
              timeframe === 'month' && styles.timeframeButtonActive,
            ]}
            onPress={() => setTimeframe('month')}>
            <Text
              style={[
                styles.timeframeButtonText,
                timeframe === 'month' && styles.timeframeButtonTextActive,
              ]}>
              Month
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.timeframeButton,
              timeframe === 'year' && styles.timeframeButtonActive,
            ]}
            onPress={() => setTimeframe('year')}>
            <Text
              style={[
                styles.timeframeButtonText,
                timeframe === 'year' && styles.timeframeButtonTextActive,
              ]}>
              Year
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={styles.statValue}>$12,450</Text>
          <Text style={styles.statChange}>+15.3%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Profit</Text>
          <Text style={styles.statValue}>$4,270</Text>
          <Text style={styles.statChange}>+8.2%</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sales Trend</Text>
        <LineChart
          data={salesData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Profit Analysis</Text>
        <BarChart
          data={profitData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Key Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Best Selling Product</Text>
          <Text style={styles.insightValue}>Product A</Text>
          <Text style={styles.insightDetail}>150 units sold</Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Most Profitable Category</Text>
          <Text style={styles.insightValue}>Electronics</Text>
          <Text style={styles.insightDetail}>32% profit margin</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  timeframeButtons: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f7',
    borderRadius: 10,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeframeButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeframeButtonText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  timeframeButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginVertical: 8,
  },
  statChange: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightsContainer: {
    padding: 20,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  insightCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginVertical: 8,
  },
  insightDetail: {
    fontSize: 14,
    color: '#8E8E93',
  },
});