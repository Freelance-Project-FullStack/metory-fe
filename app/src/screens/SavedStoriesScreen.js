import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {savedStories, collections} from '../data/mockData'

const SavedStoriesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'collections'

  const renderStoryItem = ({ item }) => (
    <TouchableOpacity style={styles.storyItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.storyThumbnail} />
      <View style={styles.playOverlay}>
        <Ionicons name="play" size={16} color="#fff" />
      </View>
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{item.duration}</Text>
      </View>
      
      <View style={styles.storyInfo}>
        <Text style={styles.storyTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.storyUser}>@{item.user}</Text>
        
        <View style={styles.storyMeta}>
          <View style={[styles.topicTag, { backgroundColor: item.topicColor }]}>
            <Text style={styles.topicTagText}>{item.topic}</Text>
          </View>
          <Text style={styles.storyViews}>{item.views} views</Text>
        </View>
        
        <Text style={styles.savedAt}>Đã lưu {item.savedAt}</Text>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={16} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity style={styles.collectionItem}>
      <View style={[styles.collectionThumbnail, { backgroundColor: item.color }]}>
        <Image source={{ uri: item.thumbnail }} style={styles.collectionImage} />
        <View style={styles.collectionOverlay}>
          <Text style={styles.collectionCount}>{item.count}</Text>
        </View>
      </View>
      <Text style={styles.collectionName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stories đã lưu</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Tất cả ({savedStories.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'collections' && styles.activeTab]}
          onPress={() => setActiveTab('collections')}
        >
          <Text style={[styles.tabText, activeTab === 'collections' && styles.activeTabText]}>
            Bộ sưu tập ({collections.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'all' ? (
          <FlatList
            data={savedStories}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Create Collection Button */}
            <TouchableOpacity style={styles.createCollectionButton}>
              <Ionicons name="add" size={24} color="#007AFF" />
              <Text style={styles.createCollectionText}>Tạo bộ sưu tập mới</Text>
            </TouchableOpacity>

            {/* Collections Grid */}
            <View style={styles.collectionsGrid}>
              {collections.map((collection) => (
                <View key={collection.id} style={styles.collectionWrapper}>
                  {renderCollectionItem({ item: collection })}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Empty State */}
      {savedStories.length === 0 && activeTab === 'all' && (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>Chưa có stories nào được lưu</Text>
          <Text style={styles.emptyDescription}>
            Nhấn vào biểu tượng bookmark trên stories để lưu chúng vào đây
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  storyItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  storyThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  playOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storyInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  storyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storyUser: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  topicTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storyViews: {
    color: '#666',
    fontSize: 12,
  },
  savedAt: {
    color: '#666',
    fontSize: 12,
  },
  moreButton: {
    padding: 8,
  },
  createCollectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  createCollectionText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  collectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  collectionWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  collectionItem: {
    alignItems: 'center',
  },
  collectionThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  collectionImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  collectionOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  collectionCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  collectionName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SavedStoriesScreen;
