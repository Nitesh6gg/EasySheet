import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ItemDetails() {
  const { id } = useLocalSearchParams();

  // This would typically fetch item details from your database
  const item = {
    id: '1',
    barcode: '123456789',
    name: 'Product A',
    description: 'High-quality product with excellent features',
    category: 'Electronics',
    price: 29.99,
    costPrice: 20.00,
    quantity: 50,
    minStock: 10,
    supplier: 'Supplier Co.',
    location: 'Warehouse A, Shelf 3',
    lastUpdated: new Date().toLocaleDateString(),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Item Details</Text>
        <Pressable onPress={() => console.log('Edit')} style={styles.editButton}>
          <Ionicons name="create" size={24} color="#007AFF" />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{item.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Barcode</Text>
              <Text style={styles.value}>{item.barcode}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{item.category}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.infoCard}>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Current Stock</Text>
              <Text style={[styles.value, styles.stockLevel]}>
                {item.quantity}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Minimum Stock</Text>
              <Text style={styles.value}>{item.minStock}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{item.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Selling Price</Text>
              <Text style={styles.value}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cost Price</Text>
              <Text style={styles.value}>${item.costPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Profit Margin</Text>
              <Text style={[styles.value, styles.profit]}>
                {((item.price - item.costPrice) / item.price * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Supplier</Text>
              <Text style={styles.value}>{item.supplier}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Last Updated</Text>
              <Text style={styles.value}>{item.lastUpdated}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, styles.adjustButton]}
          onPress={() => console.log('Adjust Stock')}>
          <Ionicons name="add-circle" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Adjust Stock</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.sellButton]}
          onPress={() => router.push('/sales/new')}>
          <Ionicons name="cart" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Sell Item</Text>
        </Pressable>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  description: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  stockLevel: {
    color: '#34C759',
    fontWeight: '600',
  },
  profit: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  adjustButton: {
    backgroundColor: '#FF9500',
  },
  sellButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});