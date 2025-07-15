import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';

const StoryItem = ({ story, isViewable }) => {
  const player = useVideoPlayer(story.video_url, (player) => {
    player.loop = true;
    player.muted = false;
  });

  const [isLoading, setIsLoading] = useState(true);
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
    // Logic tự động phát/dừng dựa trên việc item có đang hiển thị không
    if (isViewable) {
      player.play();
    } else {
      player.pause();
    }
  }, [isViewable, player]);

  // Theo dõi trạng thái loading của video
  useEvent(player, 'loadingStateChange', (event) => {
      setIsLoading(event.loadingState === 'loading' || event.loadingState === 'stalled');
  });

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      
      {isLoading && (
          <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
          </View>
      )}

      {/* Overlay để đặt các nút và thông tin */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={togglePlay}>
        <View style={styles.bottomContainer}>
          <Text style={styles.username}>@{story.user.name}</Text>
          <Text style={styles.title} numberOfLines={2}>{story.title}</Text>
        </View>

        {!isPlaying && !isLoading && (
            <View style={styles.playIconContainer}>
                <Ionicons name="play" size={80} color="rgba(255, 255, 255, 0.7)" />
            </View>
        )}

        {/* Thêm các nút actions (like, comment, share) ở đây nếu cần */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default StoryItem;