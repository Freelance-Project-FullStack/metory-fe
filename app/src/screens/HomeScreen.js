import React, { useState, useRef } from 'react';
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
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Video from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const translateY = useSharedValue(0);
  const videoRefs = useRef([]);

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

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = context.startY + event.translationY;
    },
    onEnd: (event) => {
      const shouldGoToNext = event.translationY < -50 && event.velocityY < -500;
      const shouldGoToPrev = event.translationY > 50 && event.velocityY > 500;

      if (shouldGoToNext && currentStoryIndex < stories.length - 1) {
        translateY.value = withSpring(-height);
        runOnJS(setCurrentStoryIndex)(currentStoryIndex + 1);
      } else if (shouldGoToPrev && currentStoryIndex > 0) {
        translateY.value = withSpring(height);
        runOnJS(setCurrentStoryIndex)(currentStoryIndex - 1);
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

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
        isPlaying={index === currentStoryIndex}
        isLooping
        muted={false}
      />

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Top Header */}
      <View style={styles.topHeader}>
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
                <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
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
        <TouchableOpacity style={styles.actionButton}>
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

        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}> {/* <--- Thêm onPress */}
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

      <View style={styles.progressContainer}>
        {stories.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.progressDot,
              idx === currentStoryIndex && styles.activeProgressDot,
              idx < currentStoryIndex && styles.completedProgressDot,
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 0 : insets.top }]}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <FlatList
            data={stories}
            renderItem={renderStory}
            keyExtractor={(item) => item.id.toString()}
            pagingEnabled
            vertical
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 90 : 95 + insets.bottom }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.y / height);
              setCurrentStoryIndex(index);
            }}
          />
        </Animated.View>
      </PanGestureHandler>

      {/* Floating Create Button */}
      <TouchableOpacity
        style={styles.createButton}
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
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
    marginRight: 4,
  },
  timeAgo: {
    color: '#ccc',
    fontSize: 12,
  },
  menuButton: {
    padding: 8,
  },
  topicBadge: {
    position: 'absolute',
    top: 110,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  topicText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  storyContent: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 80,
    zIndex: 10,
  },
  storyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storyDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },
  activeProgressDot: {
    backgroundColor: '#fff',
  },
  completedProgressDot: {
    backgroundColor: '#007AFF',
  },
  createButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HomeScreen;
