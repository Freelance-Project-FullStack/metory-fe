// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StoryCard from '../components/StoryCard';
import { stories } from '../data/mockData';

const HomeScreen = ({ navigation }) => {
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Metory</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={26} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="person-circle-outline" size={30} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={stories}
        renderItem={({ item }) => (
          <StoryCard
            story={item}
            onPress={() => navigation.navigate('Interaction', { story: item })}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />
       {/* Floating Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => { /* Navigate to Create Story Screen */ }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 8,
  },
    createButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3A57',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3A57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default HomeScreen;