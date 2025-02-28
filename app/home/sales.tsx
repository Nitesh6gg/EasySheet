import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SAMPLE_SALES = [
  {
    id: '1',
    date: '2024-02-20',
    customer: 'John Doe',
    total: 299.99,
    items: 3,
    status: 'Completed',
  },
  {
    id: '2',
    date: '2024-02-19',
    customer: 'Jane Smith',
    total: 149.99,
    items: 2,
    status: 'Pending',
  },
  // Add more sample sales as needed
];

export default function Sales() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.saleCard}
      onPress={() => router.push(`/sales/${item.id}`)}>
      <View style={styles.saleHeader}>
        <Text style={styles.saleDate}>{item.date}</Text>
        <Text
          style={[
            styles.saleStatus,
            {
              color:
                item.status === 'Completed' ? '#34C759' : '#FF9500',
            },
          ]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.customerName}>{item.customer}</Text>
      <View style={styles.saleDetails}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Items</Text>
          <Text style={styles.detailValue}>{item.items}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>${item.total}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sales..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/sales/new')}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </View>

      <FlatList
        data={SAMPLE_SALES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  saleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saleDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  saleStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  saleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailColumn: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});