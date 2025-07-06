import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('stories'); // 'stories' or 'users'
  const [recentSearches, setRecentSearches] = useState([
    'Du lịch Đà Lạt',
    'Ẩm thực Việt Nam',
    'Yoga',
    'Công nghệ mới',
  ]);

  const trendingTopics = [
    { id: 1, title: 'Du lịch', count: '2.5K stories', color: '#ff6b6b' },
    { id: 2, title: 'Ẩm thực', count: '1.8K stories', color: '#4ecdc4' },
    { id: 3, title: 'Thể thao', count: '1.2K stories', color: '#45b7d1' },
    { id: 4, title: 'Công nghệ', count: '950 stories', color: '#96ceb4' },
    { id: 5, title: 'Âm nhạc', count: '800 stories', color: '#feca57' },
    { id: 6, title: 'Phim ảnh', count: '650 stories', color: '#ff9ff3' },
  ];

  const searchResults = {
    stories: [
      {
        id: 1,
        title: 'Chuyến đi Đà Lạt 2024',
        user: 'Minh Anh',
        thumbnail: 'https://picsum.photos/200/200?random=1',
        views: '12K',
        duration: '45s',
        topic: 'Du lịch',
      },
      {
        id: 2,
        title: 'Món phở bò truyền thống',
        user: 'Thanh Huy',
        thumbnail: 'https://picsum.photos/200/200?random=2',
        views: '8.5K',
        duration: '38s',
        topic: 'Ẩm thực',
      },
      {
        id: 3,
        title: 'Yoga buổi sáng',
        user: 'Thu Hiền',
        thumbnail: 'https://picsum.photos/200/200?random=3',
        views: '15K',
        duration: '52s',
        topic: 'Thể thao',
      },
    ],
    users: [
      {
        id: 1,
        name: 'Minh Anh',
        username: '@minhanh_travel',
        avatar: 'https://picsum.photos/100/100?random=1',
        followers: '125K',
        verified: true,
        bio: 'Travel enthusiast & storyteller',
      },
      {
        id: 2,
        name: 'Thanh Huy',
        username: '@chef_huy',
        avatar: 'https://picsum.photos/100/100?random=2',
        followers: '89K',
        verified: false,
        bio: 'Food lover sharing recipes',
      },
      {
        id: 3,
        name: 'Thu Hiền',
        username: '@yoga_hien',
        avatar: 'https://picsum.photos/100/100?random=3',
        followers: '210K',
        verified: true,
        bio: 'Yoga instructor & wellness coach',
      },
    ],
  };

  const clearRecentSearch = (index) => {
    const newRecentSearches = [...recentSearches];
    newRecentSearches.splice(index, 1);
    setRecentSearches(newRecentSearches);
  };

  const renderStoryItem = ({ item }) => (
    <TouchableOpacity style={styles.storyItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.storyThumbnail} />
      <View style={styles.storyInfo}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.storyUser}>@{item.user}</Text>
        <View style={styles.storyMeta}>
          <Text style={styles.storyViews}>{item.views} lượt xem</Text>
          <Text style={styles.storyDuration}>{item.duration}</Text>
          <View style={styles.topicTag}>
            <Text style={styles.topicTagText}>{item.topic}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={16} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem}>
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.verified && (
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
          )}
        </View>
        <Text style={styles.userUsername}>{item.username}</Text>
        <Text style={styles.userBio}>{item.bio}</Text>
        <Text style={styles.userFollowers}>{item.followers} người theo dõi</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Theo dõi</Text>
      </TouchableOpacity>
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
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm stories, người dùng..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stories' && styles.activeTab]}
          onPress={() => setActiveTab('stories')}
        >
          <Text style={[styles.tabText, activeTab === 'stories' && styles.activeTabText]}>
            Stories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Người dùng
          </Text>
        </TouchableOpacity>
      </View>

      {searchQuery.length === 0 ? (
        <ScrollView style={styles.content}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={styles.clearAll}>Xóa tất cả</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.recentText}>{search}</Text>
                  <TouchableOpacity onPress={() => clearRecentSearch(index)}>
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Trending Topics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chủ đề thịnh hành</Text>
            <View style={styles.topicsGrid}>
              {trendingTopics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={[styles.topicCard, { backgroundColor: topic.color }]}
                  onPress={() => setSearchQuery(topic.title)}
                >
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicCount}>{topic.count}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        /* Search Results */
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Kết quả cho "{searchQuery}"
            </Text>
          </View>
          <FlatList
            data={searchResults[activeTab]}
            renderItem={activeTab === 'stories' ? renderStoryItem : renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearAll: {
    color: '#007AFF',
    fontSize: 14,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  recentText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCard: {
    width: '48%',
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topicCount: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  storyItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  storyThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  storyInfo: {
    flex: 1,
    marginLeft: 12,
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
    marginBottom: 4,
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyViews: {
    color: '#666',
    fontSize: 12,
    marginRight: 8,
  },
  storyDuration: {
    color: '#666',
    fontSize: 12,
    marginRight: 8,
  },
  topicTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topicTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  userUsername: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  userBio: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  userFollowers: {
    color: '#666',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default SearchScreen;
