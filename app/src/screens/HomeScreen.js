import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  ScrollView,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { stories } from "../data/mockData";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const HEADER_HEIGHT = 60;
const TOPIC_CARD_WIDTH = screenWidth * 0.8;
const TOPIC_CARD_HEIGHT = screenHeight * 0.5;

const HomeScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollX = useRef(new Animated.Value(0)).current;
  const categories = ["Tất cả", "Công nghệ", "Du lịch", "Ẩm thực", "Thể thao", "Giáo dục"];

  // Lọc story theo danh mục
  const filteredStories = stories.filter(story => {
    const matchesCategory = activeCategory === "Tất cả" || 
      story.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      story.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render danh mục
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveCategory(item)}
      style={[
        styles.categoryButton,
        activeCategory === item && styles.activeCategoryButton
      ]}
    >
      <Text style={[
        styles.categoryText,
        activeCategory === item && styles.activeCategoryText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Render topic card
  const renderTopicCard = ({ item, index }) => {
    const inputRange = [
      (index - 1) * TOPIC_CARD_WIDTH,
      index * TOPIC_CARD_WIDTH,
      (index + 1) * TOPIC_CARD_WIDTH,
    ];
    
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [0, -20, 0],
      extrapolate: 'clamp'
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View 
        style={[
          styles.topicCard, 
          { 
            transform: [{ translateY }, { scale }],
            marginLeft: index === 0 ? (screenWidth - TOPIC_CARD_WIDTH) / 2 : 20,
            marginRight: index === filteredStories.length - 1 ? (screenWidth - TOPIC_CARD_WIDTH) / 2 : 0
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("VideoFeed", { 
            stories: [item], 
            initialIndex: 0 
          })}
        >
          <Image 
            source={{ uri: item.coverImage }} 
            style={styles.topicImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.topicGradient}
          />
          
          <View style={styles.topicInfo}>
            <Text style={styles.topicTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.topicMeta}>
              <View style={styles.userInfo}>
                <Image 
                  source={{ uri: item.user.avatar }} 
                  style={styles.userAvatar}
                />
                <Text style={styles.userName}>{item.user.name}</Text>
              </View>
              <View style={styles.videoCount}>
                <Ionicons name="videocam" size={16} color="#fff" />
                <Text style={styles.countText}>{item.metoryData.length} video</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => navigation.navigate("VideoFeed", { 
              stories: [item], 
              initialIndex: 0 
            })}
          >
            <Ionicons name="play" size={32} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render topic grid (dành cho chế độ xem lưới)
  const renderTopicGrid = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate("VideoFeed", { 
        stories: [item], 
        initialIndex: 0 
      })}
    >
      <Image 
        source={{ uri: item.coverImage }} 
        style={styles.gridImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gridGradient}
      />
      <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
      <View style={styles.gridUser}>
        <Image 
          source={{ uri: item.user.avatar }} 
          style={styles.gridAvatar}
        />
        <Text style={styles.gridUserName}>{item.user.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với tìm kiếm */}
      <BlurView intensity={80} tint="light" style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Metory</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm chủ đề, người dùng..."
              placeholderTextColor="#8e8e93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image 
              source={{ uri: stories[0].user.avatar }} 
              style={styles.profileAvatar}
            />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Danh mục */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Chế độ xem carousel hoặc grid */}
      {filteredStories.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Chủ đề nổi bật</Text>
          <Animated.FlatList
            data={filteredStories}
            renderItem={renderTopicCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TOPIC_CARD_WIDTH + 20}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } }}],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />
          
          <Text style={styles.sectionTitle}>Khám phá thêm</Text>
          <FlatList
            data={filteredStories}
            renderItem={renderTopicGrid}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContainer}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color="#e0e0e0" />
          <Text style={styles.emptyText}>Không tìm thấy chủ đề phù hợp</Text>
          <Text style={styles.emptySubText}>Thử tìm kiếm với từ khóa khác</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery("");
              setActiveCategory("Tất cả");
            }}
          >
            <Text style={styles.resetButtonText}>Đặt lại bộ lọc</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Nút tạo mới */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateStory")}
      >
        <LinearGradient
          colors={['#FF3A57', '#FF808F']}
          style={styles.createButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    height: HEADER_HEIGHT,
    width: '100%',
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 0,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#FF3A57',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 16,
    color: '#1a1a1a',
  },
  topicCard: {
    width: TOPIC_CARD_WIDTH,
    height: TOPIC_CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  topicImage: {
    width: '100%',
    height: '100%',
  },
  topicGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  topicInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  topicMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  videoCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -28,
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 58, 87, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: (screenWidth - 40) / 2,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  gridTitle: {
    position: 'absolute',
    bottom: 40,
    left: 12,
    right: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  gridUser: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  gridUserName: {
    fontSize: 12,
    color: '#fff',
  },
  createButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: "#FF3A57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  createButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 8,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#FF3A57',
    borderRadius: 24,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;