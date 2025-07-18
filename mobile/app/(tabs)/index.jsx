import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Sample data for spare parts

const categories = [
  { id: 1, name: 'All Types', icon: 'apps-outline', active: true },
  { id: 2, name: 'Engine', icon: 'car-outline', active: false },
  { id: 3, name: 'Brakes', icon: 'disc-outline', active: false },
  { id: 4, name: 'Filters', icon: 'funnel-outline', active: false },
  { id: 5, name: 'Electrical', icon: 'flash-outline', active: false },
];

export default function Home() {
  const { user, token, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Types');
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchParts = async (PageNum = 1,refresh = false) => {
    try{
      if (refresh) setRefreshing(true);
      else if(PageNum === 1) setLoading(true);
      const response = await fetch(`http://192.168.1.7:3000/api/spareParts?page=${PageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch parts');
      }
      setParts(prevParts => {
        if (refresh) return data.spareParts;
        return [...prevParts, ...data.spareParts];
      });
      setHasMore(data.spareParts.length > 0);
      setPage(PageNum);
      
    }
    catch (err) {
      console.error('Error fetching parts:', err);
      setError(err.message);
      setLoading(false);
      setRefreshing(false);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [page, token]);

  // Filter parts based on search and category
const filteredParts = parts.filter(part => {
  const matchesSearch = part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       part.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       part.model?.toLowerCase().includes(searchQuery.toLowerCase());
  
  const matchesCategory = selectedCategory === 'All Types' || 
                         part.category === selectedCategory;
  
  return matchesSearch && matchesCategory;
});

  const router = useRouter();

  const handleReserve = (partId) => {
    // Handle reservation logic
    console.log('Reserving part:', partId);
    router.push(`/part/${partId}`);
  };

  const renderPartCard = ({ item }) => (
    <View style={styles.partCard}>
      <Image source={{ uri: item.image }} style={styles.partImage} />
      
      <View style={styles.partInfo}>
        <Text style={styles.partName}>{item.name}</Text>
        <Text style={styles.partBrand}>{item.carBrand} {item.carModel}</Text>
        <Text style={styles.partYear}>{item.carYear}</Text>
        
        <View style={styles.storeInfo}>
          <Ionicons name="storefront-outline" size={12} color="#666" />
          <Text style={styles.storeName}>{item.store}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: item.quantity > 0 ? '#E8F5E8' : '#FFF3E0' }
          ]}>
            <Text style={[
              styles.availabilityText,
              { color: item.availability === 'In Stock' ? '#4CAF50' : '#FF9800' }
            ]}>
              {item.availability}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.reserveButton}
          onPress={() => handleReserve(item._id)}
        >
          <Text style={styles.reserveButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  console.log('Filtered Parts:', parts);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.name && styles.activeCategoryChip
      ]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={selectedCategory === item.name ? '#FFFFFF' : '#666'} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.name && styles.activeCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>Location</Text>
          </View>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.locationName}>Naperville, Illinois</Text>
        
        <Text style={styles.welcomeText}>
          {user ? `Welcome, ${user.firstname}!` : 'Welcome!'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for spare parts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <Text style={styles.promoCode}>Use code FIRST50 at checkout</Text>
          <Text style={styles.promoTitle}>Get 50% Off Your First Order!</Text>
        </View>
        <Image 
          source={{ uri: 'https://via.placeholder.com/80x60/4CAF50/FFFFFF?text=Car+Parts' }}
          style={styles.promoImage}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Parts Grid */}
      <FlatList
        data={filteredParts}
        renderItem={renderPartCard}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.partsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#9CFF2E',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  promoContent: {
    flex: 1,
  },
  promoCode: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  promoImage: {
    width: 60,
    height: 45,
    borderRadius: 8,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  partsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  partCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: (width - 50) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  partBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  partYear: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  reserveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});