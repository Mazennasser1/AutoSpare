import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCartStore } from '../../store/cartStore';

const { width } = Dimensions.get('window');

export default function PartDetails() {
  const { token } = useAuthStore();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const fetchPartDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.1.7:3000/api/spareParts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch part details');
      }
      
      const data = await response.json();
      setPart(data);
    } catch (err) {
      console.error('Error fetching part details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPartDetails();
    }
  }, [id, token]);

const handleAddToCart = async () => {
  if (!part || !token) {
    Alert.alert('Error', 'Part details not available or user not authenticated');
    return;
  }

  try {
    const cartItem = {
      ...part,          // Spread all part details
      quantity: quantity || 1, // Fallback to 1 if quantity is undefined
      availableQuantity: part.quantity 
    };

    // Access cart store directly (no need for async/await with Zustand)
    useCartStore.getState().addItem(cartItem);
    
    Alert.alert('Success', `${part.name} (Qty: ${quantity || 1}) added to cart!`);
    setShowAddToCartModal(false);
  } catch (error) {
    console.error('Error adding to cart:', error);
    Alert.alert('Error', error.message || 'Failed to add item to cart');
  }
};

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (part?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };
  console.log('quantity:', quantity);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading part details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !part) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading part details</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPartDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const images = part.images || [part.image];
  console.log('part storeId:', part.storeId.name);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Part Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: images[selectedImage] || part.image }} 
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {images.length > 1 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imageGallery}
            >
              {images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnailContainer,
                    selectedImage === index && styles.selectedThumbnail
                  ]}
                  onPress={() => setSelectedImage(index)}
                >
                  <Image source={{ uri: image }} style={styles.thumbnail} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Part Information */}
        <View style={styles.infoSection}>
          <Text style={styles.partName}>{part.name}</Text>
          
          <View style={styles.carInfo}>
            <Text style={styles.carBrand}>{part.carBrand} {part.carModel}</Text>
            <Text style={styles.carYear}>{part.carYear}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${part.price.toFixed(2)}</Text>
            <View style={[
              styles.availabilityBadge,
              { backgroundColor: part.quantity > 0 ? '#E8F5E8' : '#FFF3E0' }
            ]}>
              <Text style={[
                styles.availabilityText,
                { color: part.availability === 'In Stock' ? '#4CAF50' : '#FF9800' }
              ]}>
                {part.availability}
              </Text>
            </View>
          </View>

          {/* Store Information */}
          <View style={styles.storeSection}>
            <View style={styles.storeHeader}>
              <Ionicons name="storefront-outline" size={20} color="#666" />
              <Text style={styles.storeName}>{part.storeId.name}</Text>
            </View>
            <View style={styles.storeDetails}>
              <View style={styles.storeDetailItem}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.storeDetailText}>
                  {part.storeId.location.address || "Store address not available"}
                </Text>
              </View>
              <View style={styles.storeDetailItem}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.storeDetailText}>
                  {part.storeHours || "Mon-Sat: 9AM-6PM"}
                </Text>
              </View>
            </View>
          </View>
          

          {/* Part Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Part Details</Text>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{part.category}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Brand:</Text>
              <Text style={styles.detailValue}>{part.carBrand}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Part Number:</Text>
              <Text style={styles.detailValue}>{part.partNumber || "N/A"}</Text>
            </View>
            
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Warranty:</Text>
              <Text style={styles.detailValue}>{part.warranty || "30 days"}</Text>
            </View>
          </View>

          {/* Description */}
          {part.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{part.description}</Text>
            </View>
          )}

          {/* Quantity Selection */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={quantity <= 1 ? "#ccc" : "#333"} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity
                style={[styles.quantityButton, quantity >= part.quantity && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= part.quantity}
              >
                <Ionicons name="add" size={20} color={quantity >= part.quantity ? "#ccc" : "#333"} />
              </TouchableOpacity>
            </View>
            <Text style={styles.stockText}>
              {part.quantity} available in stock
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${(part.price * quantity).toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            part.quantity === 0 && styles.addToCartButtonDisabled
          ]}
          onPress={() => setShowAddToCartModal(true)}
          disabled={part.quantity === 0}
        >
          <Ionicons name="cart-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartButtonText}>
            {part.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add to Cart Confirmation Modal */}
      <Modal
        visible={showAddToCartModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddToCartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to Cart</Text>
            <Text style={styles.modalText}>
              Add {quantity} unit(s) of {part.name} to your cart?
            </Text>
            <Text style={styles.modalTotal}>
              Total: ${(part.price * quantity).toFixed(2)}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddToCartModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={() => {
                  setShowAddToCartModal(false);
                  handleAddToCart();
                }}
              >
                <Text style={styles.modalConfirmText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: '#F8F8F8',
    paddingBottom: 15,
  },
  mainImage: {
    width: width,
    height: 300,
    backgroundColor: '#F0F0F0',
  },
  imageGallery: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  thumbnailContainer: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#4CAF50',
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  infoSection: {
    padding: 20,
  },
  partName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  carInfo: {
    marginBottom: 15,
  },
  carBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  carYear: {
    fontSize: 14,
    color: '#999',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  storeSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  storeDetails: {
    marginLeft: 28,
  },
  storeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  storeDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  detailsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 25,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  quantitySection: {
    marginBottom: 100,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#CCC',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});