import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Platform,
  Share
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const translateY = useSharedValue(0);
  const videoRefs = useRef([]);
  const insets = useSafeAreaInsets();

  const stories = [
    {
      id: 1,
      user: {
        name: 'Minh Anh',
        avatar: 'https://picsum.photos/100/100?random=1',
        verified: true,
      },
      topic: {
        title: 'Du lịch',
        icon: 'airplane',
        color: '#ff6b6b',
      },
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://picsum.photos/400/600?random=1',
      title: 'Chuyến đi Đà Lạt đáng nhớ',
      description: 'Chia sẻ những khoảnh khắc tuyệt vời tại thành phố ngàn hoa...',
      likes: 1250,
      comments: 89,
      shares: 23,
      isLiked: false,
      duration: 45,
      createdAt: '2 giờ trước',
    },
    {
      id: 2,
      user: {
        name: 'Thanh Huy',
        avatar: 'https://picsum.photos/100/100?random=2',
        verified: false,
      },
      topic: {
        title: 'Ẩm thực',
        icon: 'restaurant',
        color: '#4ecdc4',
      },
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail: 'https://picsum.photos/400/600?random=2',
      title: 'Món phở bò truyền thống',
      description: 'Cách nấu phở bò ngon như hàng quán...',
      likes: 890,
      comments: 56,
      shares: 12,
      isLiked: true,
      duration: 38,
      createdAt: '5 giờ trước',
    },
    {
      id: 3,
      user: {
        name: 'Thu Hiền',
        avatar: 'https://picsum.photos/100/100?random=3',
        verified: true,
      },
      topic: {
        title: 'Thể thao',
        icon: 'football',
        color: '#45b7d1',
      },
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://picsum.photos/400/600?random=3',
      title: 'Yoga buổi sáng energetic',
      description: 'Bài tập yoga giúp bạn khởi đầu ngày mới đầy năng lượng...',
      likes: 2100,
      comments: 145,
      shares: 67,
      isLiked: false,
      duration: 52,
      createdAt: '1 ngày trước',
    },
  ];

  const handleShare = async (story) => {
    try {
      const result = await Share.share({
        message: `Xem story "${story.title}" của ${story.user.name} trên Metory!`,
        url: `https://metory.app/story/${story.id}`, // URL này chỉ là giả định
        title: `Chia sẻ story: ${story.title}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log(`Shared with type: ${result.activityType}`);
        } else {
          // shared
          console.log('Story shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderStory = ({ item, index }) => (
    <View style={styles.storyContainer}>
      {/* Video Background */}
      <Video
        ref={(ref) => (videoRefs.current[index] = ref)}
        style={styles.video}
        source={{ uri: item.videoUrl }}
        resizeMode="cover"
        shouldPlay={index === currentStoryIndex}
        isLooping
        muted={false}
      />

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { top: insets.top + 10 }]}>
        {stories.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.progressBar,
              idx === currentStoryIndex && styles.activeProgressBar,
              idx < currentStoryIndex && styles.completedProgressBar,
            ]}
          />
        ))}
      </View>

      {/* Top Header */}
      <View style={[styles.topHeader, { top: insets.top + 40 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{item.user.name}</Text>
              {item.user.verified && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={16} 
                  color="#007AFF" 
                  style={styles.verifiedIcon} 
                />
              )}
            </View>
            <Text style={styles.timeAgo}>{item.createdAt}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Topic Badge */}
      <View style={[styles.topicBadge, { backgroundColor: item.topic.color }]}>
        <Ionicons name={item.topic.icon} size={16} color="#fff" />
        <Text style={styles.topicText}>{item.topic.title}</Text>
      </View>

      {/* Story Content */}
      <View style={styles.storyContent}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.storyDescription}>{item.description}</Text>
      </View>

      {/* Right Actions */}
      <View style={styles.rightActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(index)}
        >
          <Ionicons
            name={item.isLiked ? "heart" : "heart-outline"}
            size={32}
            color={item.isLiked ? "#ff4757" : "#fff"}
          />
          <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleShare(item)}
        >
          <Ionicons name="arrow-redo-outline" size={28} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="volume-high-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          vertical
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.y / height);
            setCurrentStoryIndex(index);
          }}
        />
      </Animated.View>

      {/* Floating Create Button */}
      <TouchableOpacity
        style={[styles.createButton, { bottom: insets.bottom + 30 }]}
        onPress={() => navigation.navigate('CreateStory')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  storyContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  progressContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  progressBar: {
    height: 3,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeProgressBar: {
    backgroundColor: '#fff',
    height: 4,
  },
  completedProgressBar: {
    backgroundColor: '#007AFF',
  },
  topHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    marginRight: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 5,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  timeAgo: {
    color: '#e0e0e0',
    fontSize: 12,
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  topicBadge: {
    position: 'absolute',
    top: 100,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topicText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  storyContent: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 80,
    zIndex: 10,
  },
  storyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  storyDescription: {
    color: '#f0f0f0',
    fontSize: 15,
    lineHeight: 22,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  createButton: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FF3A57',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3A57',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default HomeScreen;