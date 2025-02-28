import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,TextInput,ScrollView,Pressable,Platform,} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraView, Camera } from "expo-camera/next";

export default function NewItem() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    description: '',
    category: '',
    price: '',
    costPrice: '',
    quantity: '',
    minStock: '',
    supplier: '',
    location: '',
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setFormData(prev => ({ ...prev, barcode: data }));
    setScanning(false);
  };

  const handleSave = () => {
    // Here you would typically save the item to your database
    console.log('Saving item:', formData);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Add New Item</Text>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.barcodeSection}>
          <View style={styles.barcodeInput}>
            <TextInput
              style={styles.input}
              placeholder="Barcode"
              value={formData.barcode}
              onChangeText={(text) => setFormData(prev => ({ ...prev, barcode: text }))}
            />
            {Platform.OS !== 'web' && (
              <Pressable
                onPress={() => setScanning(true)}
                style={styles.scanButton}>
                <Ionicons name="barcode" size={24} color="#007AFF" />
              </Pressable>
            )}
          </View>
        </View>

        {scanning && Platform.OS !== 'web' && (
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={styles.scanner}
            />
            <Pressable
              onPress={() => setScanning(false)}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Scan</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={formData.category}
            onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pricing</Text>
          <TextInput
            style={styles.input}
            placeholder="Selling Price"
            keyboardType="decimal-pad"
            value={formData.price}
            onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost Price"
            keyboardType="decimal-pad"
            value={formData.costPrice}
            onChangeText={(text) => setFormData(prev => ({ ...prev, costPrice: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stock Management</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="number-pad"
            value={formData.quantity}
            onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Minimum Stock Level"
            keyboardType="number-pad"
            value={formData.minStock}
            onChangeText={(text) => setFormData(prev => ({ ...prev, minStock: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Supplier"
            value={formData.supplier}
            onChangeText={(text) => setFormData(prev => ({ ...prev, supplier: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Storage Location"
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
          />
        </View>
      </ScrollView>
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  barcodeSection: {
    marginBottom: 20,
  },
  barcodeInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButton: {
    padding: 10,
    marginLeft: 8,
  },
  scannerContainer: {
    aspectRatio: 1,
    width: '100%',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});