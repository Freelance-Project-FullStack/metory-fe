import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LibraryScreen = () => {
  const watchlist = [
    {
      id: 1,
      title: 'The Mandalorian',
      progress: 0.7,
      image: 'https://via.placeholder.com/150x200/333/ffffff?text=Mandalorian',
    },
    {
      id: 2,
      title: 'House of Dragons',
      progress: 0.3,
      image: 'https://via.placeholder.com/150x200/444/ffffff?text=House+of+Dragons',
    },
  ];

  const downloads = [
    {
      id: 1,
      title: 'Stranger Things S4',
      size: '2.4 GB',
      image: 'https://via.placeholder.com/60x60/555/ffffff?text=ST',
    },
    {
      id: 2,
      title: 'The Crown S5',
      size: '1.8 GB',
      image: 'https://via.placeholder.com/60x60/666/ffffff?text=TC',
    },
  ];

  const renderWatchlistItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.watchlistItem}>
      <Image source={{ uri: item.image }} style={styles.watchlistImage} />
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
        </View>
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.watchlistTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderDownloadItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.downloadItem}>
      <Image source={{ uri: item.image }} style={styles.downloadImage} />
      <View style={styles.downloadInfo}>
        <Text style={styles.downloadTitle}>{item.title}</Text>
        <Text style={styles.downloadSize}>{item.size}</Text>
      </View>
      <TouchableOpacity style={styles.downloadAction}>
        <Ionicons name="download" size={20} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Library</Text>
        </View>

        {/* Continue Watching */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {watchlist.map(renderWatchlistItem)}
          </ScrollView>
        </View>

        {/* Downloads */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Downloads</Text>
          <View style={styles.downloadsList}>
            {downloads.map(renderDownloadItem)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>My Favorites</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="time-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Watch Later</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Download Settings</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  watchlistItem: {
    width: 150,
    marginRight: 15,
  },
  watchlistImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchlistTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  downloadsList: {
    paddingHorizontal: 20,
  },
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  downloadImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  downloadInfo: {
    flex: 1,
  },
  downloadTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  downloadSize: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  downloadAction: {
    padding: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
});

export default LibraryScreen;
