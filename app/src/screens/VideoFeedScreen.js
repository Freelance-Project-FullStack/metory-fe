// src/screens/VideoFeedScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const VideoFeedScreen = ({ route, navigation }) => {
  const { stories, initialIndex = 0 } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [videosRef, setVideosRef] = useState({});
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Get real screen dimensions
  const [dimensions, setDimensions] = useState(Dimensions.get('screen'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setDimensions(screen);
    });

    return () => subscription?.remove();
  }, []);

  // Force portrait orientation for TikTok-like experience
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Pause all videos except current one
  useEffect(() => {
    Object.keys(videosRef).forEach((key, index) => {
      if (videosRef[key]) {
        if (index === currentIndex) {
          videosRef[key].playAsync();
        } else {
          videosRef[key].pauseAsync();
        }
      }
    });
  }, [currentIndex, videosRef]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      setCurrentIndex(visibleIndex);
    }
  }).current;

  const renderVideoItem = ({ item, index }) => {
    return (
      <View style={[styles.videoContainer, { 
        width: dimensions.width, 
        height: dimensions.height 
      }]}>
        <Video
          ref={(ref) => {
            if (ref) {
              setVideosRef(prev => ({ ...prev, [index]: ref }));
            }
          }}
          source={{ uri: item.metoryData[0].videoUrl }}
          style={[styles.video, { 
            width: dimensions.width, 
            height: dimensions.height 
          }]}
          resizeMode="cover"
          shouldPlay={index === currentIndex}
          isLooping
          isMuted={false}
          useNativeControls={false}
        />
        
        {/* Overlay UI */}
        <View style={styles.overlay}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Khám phá</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Right side actions */}
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={32} color="#fff" />
              <Text style={styles.actionText}>125</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={32} color="#fff" />
              <Text style={styles.actionText}>23</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Interaction', { story: item })}
            >
              <Ionicons name="play-circle" size={32} color="#fff" />
              <Text style={styles.actionText}>Xem</Text>
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
      </View>
    );
  };

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
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
});

export default VideoFeedScreen;
