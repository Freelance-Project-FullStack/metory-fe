import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const discoverMovies = [
    {
      id: 1,
      title: 'Billions',
      rating: 10.9,
      image: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Billions',
      year: 2023,
    },
    {
      id: 2,
      title: 'The Crown',
      rating: 9.2,
      image: 'https://via.placeholder.com/300x400/2a2a2a/ffffff?text=The+Crown',
      year: 2023,
    },
    {
      id: 3,
      title: 'Stranger Things',
      rating: 8.7,
      image: 'https://via.placeholder.com/300x400/3a3a3a/ffffff?text=Stranger+Things',
      year: 2023,
    },
  ];

  const trendingMovies = [
    {
      id: 1,
      title: 'HOMELAND',
      image: 'https://via.placeholder.com/200x120/444/ffffff?text=HOMELAND',
    },
    {
      id: 2,
      title: 'Dark Mirror',
      image: 'https://via.placeholder.com/200x120/555/ffffff?text=Dark+Mirror',
    },
  ];

  const purchaseItems = [
    {
      id: 1,
      title: 'Gold Rush on Discovery Channel',
      price: '$2.99',
      image: 'https://via.placeholder.com/60x60/666/ffffff?text=GR',
    },
    {
      id: 2,
      title: 'Bear TMNT on Toon Channel',
      price: '$1.99',
      image: 'https://via.placeholder.com/60x60/777/ffffff?text=BT',
    },
  ];

  const renderDiscoverItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.discoverItem}>
      <Image source={{ uri: item.image }} style={styles.discoverImage} />
      <View style={styles.discoverOverlay}>
        <View style={styles.discoverHeader}>
          <TouchableOpacity style={styles.heartButton}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <TouchableOpacity style={styles.heartButton}>
            <Ionicons name="heart" size={20} color="#ff4757" />
          </TouchableOpacity>
        </View>
        <View style={styles.discoverFooter}>
          <Text style={styles.discoverTitle}>{item.title}</Text>
          <Text style={styles.discoverYear}>{item.year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTrendingItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.trendingItem}>
      <Image source={{ uri: item.image }} style={styles.trendingImage} />
      <Text style={styles.trendingTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderPurchaseItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.purchaseItem}>
      <Image source={{ uri: item.image }} style={styles.purchaseImage} />
      <View style={styles.purchaseInfo}>
        <Text style={styles.purchaseTitle}>{item.title}</Text>
        <Text style={styles.purchasePrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Showtime"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Discover Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discover</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {discoverMovies.map(renderDiscoverItem)}
          </ScrollView>
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {trendingMovies.map(renderTrendingItem)}
          </ScrollView>
        </View>

        {/* Purchase Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Purchase</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.purchaseList}>
            {purchaseItems.map(renderPurchaseItem)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#007AFF',
    fontSize: 16,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  discoverItem: {
    width: width * 0.7,
    height: 400,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  discoverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  discoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 15,
  },
  discoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  discoverFooter: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  discoverTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  discoverYear: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  trendingItem: {
    width: 200,
    marginRight: 15,
  },
  trendingImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  trendingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  purchaseList: {
    paddingHorizontal: 20,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  purchaseImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  purchaseInfo: {
    flex: 1,
  },
  purchaseTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  purchasePrice: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
