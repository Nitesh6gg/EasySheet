import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable, TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';



const SAMPLE_INVENTORY = [
  {
    id: '1',
    name: 'Product A',
    quantity: 50,
    price: 29.99,
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Product B',
    quantity: 30,
    price: 19.99,
    category: 'Accessories',
  },
  // Add more sample items as needed
];
const categories = ['All', 'Phones', 'TV', 'Laptops', 'Audio', 'Accessories'];
const [filterCategory, setFilterCategory] = useState('All');
const [sortBy, setSortBy] = useState('name');

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.itemCard}
      onPress={() => router.push(`/inventory/${item.id}`)}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <View style={styles.itemDetails}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Quantity</Text>
          <Text style={styles.detailValue}>{item.quantity}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={styles.detailValue}>${item.price}</Text>
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
            placeholder="Search inventory..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/inventory/new')}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                filterCategory === category && styles.selectedFilterChip
              ]}
              onPress={() => setFilterCategory(category)}
            >
              <Text style={[
                styles.filterChipText,
                filterCategory === category && styles.selectedFilterChipText
              ]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sortSection}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'name' && styles.selectedSortButton]}
          onPress={() => setSortBy('name')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'name' && styles.selectedSortButtonText]}>Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'stock' && styles.selectedSortButton]}
          onPress={() => setSortBy('stock')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'stock' && styles.selectedSortButtonText]}>Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price' && styles.selectedSortButton]}
          onPress={() => setSortBy('price')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price' && styles.selectedSortButtonText]}>Price</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={SAMPLE_INVENTORY}
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
  filterSection: {
    paddingHorizontal: 16,
    marginTop:10,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedFilterChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
  },
  selectedFilterChipText: {
    color: 'white',
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedSortButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    color: '#666',
    fontSize: 14,
  },
  selectedSortButtonText: {
    color: 'white',
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
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  itemCategory: {
    fontSize: 14,
    color: '#8E8E93',
  },
  itemDetails: {
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