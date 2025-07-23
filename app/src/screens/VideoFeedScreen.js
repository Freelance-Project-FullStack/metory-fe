import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Animated,
  ActivityIndicator
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { BlurView } from "expo-blur";

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const VideoItem = React.memo(({
  item,
  index,
  currentIndex,
  dimensions,
  insets,
  navigation,
  isMuted,
  onToggleMute,
  onTapVideo
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Xử lý trạng thái video
  useEffect(() => {
    if (!videoRef.current) return;
    
    const playVideo = async () => {
      if (index === currentIndex && !isPaused) {
        try {
          await videoRef.current.playAsync();
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } catch (e) {
          setError("Failed to play video");
        }
      } else {
        await videoRef.current.pauseAsync();
      }
    };

    playVideo();
  }, [currentIndex, isPaused, index]);

  // Reset trạng thái khi video không còn hiển thị
  useEffect(() => {
    if (index !== currentIndex) {
      setIsPaused(false);
      fadeAnim.setValue(0);
    }
  }, [currentIndex, index]);

  // Xử lý lỗi video
  const handleError = (error) => {
    console.error("Video error:", error);
    setError("Video playback failed");
    setIsLoading(false);
  };

  return (
    <View style={[styles.videoContainer, { 
      width: dimensions.width, 
      height: dimensions.height 
    }]}>
      <Animated.View style={[styles.videoWrapper, { opacity: fadeAnim }]}>
        <Video
          ref={videoRef}
          source={{ uri: item.metoryData[0].videoUrl }}
          style={[styles.video, { 
            width: dimensions.width, 
            height: dimensions.height 
          }]}
          resizeMode="cover"
          shouldPlay={index === currentIndex && !isPaused}
          isLooping
          isMuted={isMuted}
          useNativeControls={false}
          onLoadStart={() => setIsLoading(true)}
          onReadyForDisplay={() => setIsLoading(false)}
          onError={handleError}
        />
      </Animated.View>
      
      {/* Hiển thị lỗi */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => setError(null)}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Header */}
        <BlurView intensity={80} tint="dark" style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Khám phá</Text>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Interaction', { story: item })}
          >
            <Ionicons name="chatbubbles" size={24} color="#fff" />
          </TouchableOpacity>
        </BlurView>

        {/* Right side actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onToggleMute}
          >
            <Ionicons 
              name={isMuted ? "volume-mute" : "volume-high"} 
              size={28} 
              color="#fff" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={32} color="#fff" />
            <Text style={styles.actionText}>{item.likes || 125}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Interaction', { story: item })}
          >
            <Ionicons name="chatbubble-outline" size={32} color="#fff" />
            <Text style={styles.actionText}>{item.comments || 23}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Interaction', { story: item })}
          >
            <Ionicons name="play-circle" size={32} color="#fff" />
            <Text style={styles.actionText}>Tương tác</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Bottom info */}
        <View style={[styles.bottomInfo, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.userInfo}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text style={styles.username}>@{item.user.name}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Loading indicator */}
      {isLoading && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      
      {/* Touch area for play/pause */}
      <TouchableOpacity
        style={styles.videoTouchArea}
        activeOpacity={1}
        onPress={() => setIsPaused(!isPaused)}
      >
        {isPaused && index === currentIndex && (
          <Ionicons 
            name="play-circle" 
            size={80} 
            color="rgba(255,255,255,0.7)" 
            style={styles.pauseIcon}
          />
        )}
      </TouchableOpacity>
    </View>
  );
});

const VideoFeedScreen = ({ route, navigation }) => {
  const { stories, initialIndex = 0 } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState(Dimensions.get('screen'));
  const [isMuted, setIsMuted] = useState(false);

  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setDimensions(screen);
    });

    return () => subscription?.remove();
  }, []);

  // Khóa chế độ xoay màn hình
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Xử lý khi người dùng thay đổi video
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      setCurrentIndex(visibleIndex);
    }
  }).current;

  // Toggle chế độ âm thanh
  const toggleMute = () => setIsMuted(prev => !prev);

  // Render video item
  const renderVideoItem = ({ item, index }) => (
    <VideoItem
      item={item}
      index={index}
      currentIndex={currentIndex}
      dimensions={dimensions}
      insets={insets}
      navigation={navigation}
      isMuted={isMuted}
      onToggleMute={toggleMute}
    />
  );

  return (
    <View style={[styles.container, { 
      width: dimensions.width, 
      height: dimensions.height 
    }]}>
      <StatusBar style="light" hidden={true} />
      <FlatList
        ref={flatListRef}
        data={stories}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80,
        }}
        getItemLayout={(data, index) => ({
          length: dimensions.height,
          offset: dimensions.height * index,
          index,
        })}
        initialScrollIndex={initialIndex}
        windowSize={3}
        maxToRenderPerBatch={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    position: 'relative',
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  bottomInfo: {
    paddingHorizontal: 16,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#e0e0e0',
    fontSize: 14,
    lineHeight: 18,
  },
  videoTouchArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  pauseIcon: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 40,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 2,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 20,
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#ff4040',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VideoFeedScreen;