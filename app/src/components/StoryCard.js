// src/components/StoryCard.js

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const StoryCard = ({ story, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageBackground
        source={{ uri: story.thumbnail }}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 16 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.userInfo}>
            <Ionicons name="play-circle" size={64} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.playText}>Tap để xem</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{story.description}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight * 0.8, // 80% của màn hình
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  userInfo: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
     color: '#e0e0e0',
     fontSize: 16,
     marginTop: 6,
     lineHeight: 22,
  }
});

export default StoryCard;