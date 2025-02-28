import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,FlatList,TouchableOpacity,Modal,TextInput,ActivityIndicator,Image,ScrollView,SafeAreaView,Dimensions,StatusBar,Alert,} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons, Feather, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { convertSheetDataToObjects, SheetResponse } from '@/src/util/sheetDataConverter';
import {SHEETS_API_URL} from '@/src/config/sheetConfig';

const sheetRange="Sheet1!A1:Q999";

// Sample data for orders
const initialOrders = [
  {
    id: '1',
    productName: 'iPhone 15 Pro Max',
    orderDate: '2025-02-20',
    color: 'Titanium Blue',
    customerName: 'John Williams',
    phoneNumber: '+1 (555) 123-4567',
    status: 'Pending',
    address: '1234 Tech Lane, Silicon Valley, CA 94024',
    price: '$1,299.00',
    paymentMethod: 'Credit Card',
    barcode: 'IPHONE15PM-1234567',
    imageUrl: 'https://api.a0.dev/assets/image?text=iphone%2015%20pro%20max%20titanium%20blue%20on%20minimalist%20background&aspect=1:1&seed=42',
  },
  {
    id: '2',
    productName: 'Samsung Galaxy S24 Ultra',
    orderDate: '2025-02-21',
    color: 'Phantom Black',
    customerName: 'Emma Davis',
    phoneNumber: '+1 (555) 987-6543',
    status: 'Pending',
    address: '567 Innovation Dr, Austin, TX 78701',
    price: '$1,199.99',
    paymentMethod: 'PayPal',
    barcode: 'GALAXYS24U-7654321',
    imageUrl: 'https://api.a0.dev/assets/image?text=samsung%20galaxy%20s24%20ultra%20black%20sleek%20smartphone&aspect=1:1&seed=24',
  },

];

export default function DeliveryManagementScreen() {
  //const [orders, setOrders] = useState(initialOrders);
  const [orders, setOrders] = useState<Record<string, string>[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [signature, setSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDeliveryModal, setConfirmDeliveryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(orders);



  //calling api
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch(SHEETS_API_URL);
        const json: SheetResponse = await response.json();
        const objects = convertSheetDataToObjects(json);
        console.log('Converted Objects:', objects);
        setOrders(objects);
      } catch (error) {
        console.error('Error fetching sheet data:', error);
      }finally {
        setLoading(false);
      }
    };
    fetchSheetData();
  }, []);


  useEffect(() => {
    // Filter orders based on search query
    if (searchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        order =>
          order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.userId.includes(searchQuery)
          //order.barcode.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const handleBarcodeScan = ({ type, data }) => {
    setScanned(true);
    setScannerVisible(false);

    if (selectedOrder && data === selectedOrder.barcode) {
      Alert.alert(
        "Success",
        "Barcode verified successfully!",
        [{ text: "OK" }]
      );
      setSignature(true);
    } else {
      Alert.alert(
        "Error",
        "Barcode doesn't match the product. Please try again.",
        [
          {
            text: "Try Again",
            onPress: () => {
              setScanned(false);
              setScannerVisible(true);
            }
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
    }
  };

  const startScanner = () => {
    setScanned(false);
    setScannerVisible(true);
  };

  const markAsDelivered = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrder.id
            ? { ...order, status: 'Delivered', deliveryDate: new Date().toISOString().split('T')[0], deliveryNotes }
            : order
        )
      );

      setLoading(false);
      setConfirmDeliveryModal(false);
      setDetailsModalVisible(false);
      setSelectedOrder(null);
      setDeliveryNotes('');
      setSignature(false);

      Alert.alert(
        "Success",
        "Order marked as delivered successfully!",
        [{ text: "OK" }]
      );
    }, 1500);
  };

  const confirmDelivery = () => {
    if (!signature) {
      Alert.alert(
        "Required",
        "Please verify the product by scanning the barcode first.",
        [{ text: "OK" }]
      );
      return;
    }

    setConfirmDeliveryModal(true);
  };


  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
          <View style={styles.orderMeta}>
            <MaterialIcons name="date-range" size={14} color="#666" />
            <Text style={styles.metaText}>{item.orderDate}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Delivered' ? '#53e357' : '#FF9800' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.customerInfo}>
          <View style={styles.infoRow}>
            <Feather name="user" size={14} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>{item.userName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="phone" size={14} color="#666" />
            <Text style={styles.infoText}>{item.userId
            }</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="color-lens" size={14} color="#666" />
            <Text style={styles.infoText}>{item.color}</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="box-open" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No orders found</Text>
      <Text style={styles.emptySubText}>Try a different search term</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f7" />

      {/* Header */}
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Delivery Management</Text>
        <View style={styles.deliveryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {orders.filter(o => o.status === 'Pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {orders.filter(o => o.status === 'Delivered').length}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders by product, customer or barcode..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color="#666" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />

      {/* Order Details Modal */}
      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        {selectedOrder && (
          <View style={styles.modalOverlay}>
            <View style={styles.detailsModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Order Details</Text>
                <TouchableOpacity
                  onPress={() => setDetailsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: selectedOrder.imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={[
                    styles.detailStatusBadge,
                    { backgroundColor: selectedOrder.status === 'Delivered' ? '#4CAF50' : '#FF9800' }
                  ]}>
                    <Text style={styles.detailStatusText}>{selectedOrder.status}</Text>
                  </View>
                </View>

                <Text style={styles.detailProductName}>{selectedOrder.productName}</Text>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Customer Information</Text>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Feather name="user" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.userName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Feather name="phone" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.userId
                    }</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Feather name="map-pin" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Address:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.address}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Product Information</Text>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <MaterialIcons name="color-lens" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Color:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.color}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <MaterialIcons name="attach-money" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Price:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.price}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <MaterialIcons name="attach-money" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Buy Price:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.buyPrice}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Feather name="user" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Account Holder:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.accountHolder}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <MaterialIcons name="payment" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Payment:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.paymentMethod +" " +selectedOrder.lastFourDigit}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <MaterialCommunityIcons name="barcode-scan" size={16} color="#4c669f" />
                    </View>
                    <Text style={styles.detailLabel}>Barcode:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.barcode}</Text>
                  </View>
                </View>

                {selectedOrder.status !== 'Delivered' ? (
                  <View style={styles.deliverySection}>
                    <Text style={styles.sectionTitle}>Delivery Confirmation</Text>

                    <View style={styles.barcodeSection}>
                      <Text style={styles.instructionText}>Scan product barcode to verify</Text>
                      <TouchableOpacity
                        style={[styles.scanButton, signature && styles.scanButtonSuccess]}
                        onPress={startScanner}
                      >
                        <MaterialCommunityIcons
                          name={signature ? "check-circle" : "barcode-scan"}
                          size={24}
                          color="#fff"
                        />
                        <Text style={styles.scanButtonText}>
                          {signature ? "Verified" : "Scan Barcode"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.notesLabel}>Delivery Notes (Optional)</Text>
                    <TextInput
                      style={styles.notesInput}
                      multiline
                      placeholder="Enter any additional notes about the delivery..."
                      value={deliveryNotes}
                      onChangeText={setDeliveryNotes}
                    />

                    <TouchableOpacity
                      style={[styles.completeButton, signature ? styles.completeButtonActive : styles.completeButtonDisabled]}
                      onPress={confirmDelivery}
                      disabled={!signature}
                    >
                      <Text style={styles.completeButtonText}>Mark as Delivered</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.deliveredSection}>
                    <View style={styles.deliveredInfo}>
                      <MaterialIcons name="check-circle" size={60} color="#4CAF50" />
                      <Text style={styles.deliveredText}>Delivered on {selectedOrder.deliveryDate}</Text>
                      {selectedOrder.deliveryNotes && (
                        <View style={styles.deliveredNotes}>
                          <Text style={styles.deliveredNotesLabel}>Delivery Notes:</Text>
                          <Text style={styles.deliveredNotesText}>{selectedOrder.deliveryNotes}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      {/* Barcode Scanner Modal */}
      <Modal
        visible={scannerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setScannerVisible(false)}
      >
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarcodeScan}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.scannerOverlay}>
            <View style={styles.scannerHeader}>
              <Text style={styles.scannerTitle}>Scan Product Barcode</Text>
              <TouchableOpacity
                onPress={() => setScannerVisible(false)}
                style={styles.scannerCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.scanFrame}>
              <View style={styles.scanCorner} />
              <View style={[styles.scanCorner, styles.topRight]} />
              <View style={[styles.scanCorner, styles.bottomLeft]} />
              <View style={[styles.scanCorner, styles.bottomRight]} />
            </View>

            <Text style={styles.scannerInstructions}>
              Align the barcode within the frame
            </Text>
          </View>
        </View>
      </Modal>

      {/* Confirm Delivery Modal */}
      <Modal
        visible={confirmDeliveryModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setConfirmDeliveryModal(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModal}>
            <MaterialIcons name="local-shipping" size={60} color="#4c669f" />
            <Text style={styles.confirmTitle}>Confirm Delivery</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to mark this order as delivered?
            </Text>

            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setConfirmDeliveryModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmDeliveryButton]}
                onPress={markAsDelivered}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmDeliveryText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  deliveryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailStatusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailProductName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIconContainer: {
    width: 28,
    alignItems: 'center',
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  deliverySection: {
    marginBottom: 24,
  },
  barcodeSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4c669f',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '80%',
  },
  scanButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  notesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 20,
  },
  completeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
  },
  completeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  completeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Delivered section
  deliveredSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  deliveredInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    width: '100%',
  },
  deliveredText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
    marginBottom: 16,
  },
  deliveredNotes: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
  },
  deliveredNotesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  deliveredNotesText: {
    fontSize: 14,
    color: '#333',
  },

  // Scanner styles
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scannerCloseButton: {
    padding: 8,
  },
  scanFrame: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    left: undefined,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    top: undefined,
    bottom: 0,
    borderTopWidth: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  bottomRight: {
    top: undefined,
    left: undefined,
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scannerInstructions: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 8,
  },

  // Confirm delivery modal
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmDeliveryButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  confirmDeliveryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});