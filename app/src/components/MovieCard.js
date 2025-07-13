import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MovieCard = ({ movie, onPress, showHeart = true, showRating = true }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: movie.image }} style={styles.image} />
      
      {showHeart && (
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons 
            name={movie.isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={movie.isFavorite ? "#ff4757" : "#fff"} 
          />
        </TouchableOpacity>
      )}
      
      {showRating && movie.rating && (
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{movie.rating}</Text>
        </View>
      )}
      
      <View style={styles.overlay}>
        <Text style={styles.title}>{movie.title}</Text>
        {movie.year && (
          <Text style={styles.year}>{movie.year}</Text>
        )}
        {movie.genre && (
          <Text style={styles.genre}>{movie.genre}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.4,
    height: 240,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  year: {
    color: '#ccc',
    fontSize: 12,
  },
  genre: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
});

export default MovieCard;
