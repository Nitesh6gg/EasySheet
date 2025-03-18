import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, Platform } from 'react-native';
import { useGoogleAuth } from '@/src/api/GoogleAuthService';
import { useEffect } from 'react';

export default function Index() {

  const {userInfo} = useGoogleAuth();
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

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

  //if user not login then push to login page
 /* useEffect(() => {
    if(!userInfo){
      router.push('../');
    }
  }, []);*/

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome,{userInfo? userInfo.name:'Guest'}</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('../settings')}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#007AFF" />
          <Text style={styles.statValue}>$12,450</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cart" size={24} color="#34C759" />
          <Text style={styles.statValue}>142</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cube" size={24} color="#FF9500" />
          <Text style={styles.statValue}>1,240</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sales Overview</Text>
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
        />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/inventory/new')}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Add Product</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('../sales')}>
            <Ionicons name="cart" size={24} color="#007AFF" />
            <Text style={styles.actionText}>New Sale</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.navigate('../delivery')}>
            <Ionicons name="list" size={24} color="#007AFF" />
            <Text style={styles.actionText}>View delivery</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('../analytics')}>
            <Ionicons name="stats-chart" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Reports</Text>
          </Pressable>
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
  profileButton: {
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  date: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
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
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
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
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#000000',
  },
});