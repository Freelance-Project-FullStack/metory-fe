import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const mockResults = [
    {
      id: 1,
      title: 'Breaking Bad',
      year: 2008,
      genre: 'Drama',
      image: 'https://via.placeholder.com/150x200/333/ffffff?text=Breaking+Bad',
    },
    {
      id: 2,
      title: 'Game of Thrones',
      year: 2011,
      genre: 'Fantasy',
      image: 'https://via.placeholder.com/150x200/444/ffffff?text=Game+of+Thrones',
    },
    {
      id: 3,
      title: 'The Witcher',
      year: 2019,
      genre: 'Fantasy',
      image: 'https://via.placeholder.com/150x200/555/ffffff?text=The+Witcher',
    },
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultDetails}>{item.year} • {item.genre}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies, shows..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          style={styles.resultsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={80} color="#333" />
          <Text style={styles.emptyText}>Search for your favorite movies and shows</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  resultImage: {
    width: 80,
    height: 120,
  },
  resultInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  resultTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultDetails: {
    color: '#666',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchScreen;
