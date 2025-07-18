import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Switch,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {myStories, myprofile} from '../data/mockData'

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  const user = myprofile

  const menuItems = [
    {
      id: 1,
      title: 'Chỉnh sửa hồ sơ',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 2,
      title: 'Stories đã lưu',
      icon: 'bookmark-outline',
      onPress: () => navigation.navigate('SavedStories'),
    },
    {
      id: 3,
      title: 'Hoạt động',
      icon: 'heart-outline',
      onPress: () => navigation.navigate('Activity'),
    },
    {
      id: 4,
      title: 'Phân tích',
      icon: 'analytics-outline',
      onPress: () => navigation.navigate('Analytics'),
    },
    {
      id: 5,
      title: 'Cài đặt',
      icon: 'settings-outline',
      onPress: () => showSettingsModal(),
    },
    {
      id: 6,
      title: 'Trợ giúp & Hỗ trợ',
      icon: 'help-circle-outline',
      onPress: () => showHelpModal(),
    },
    {
      id: 7,
      title: 'Đăng xuất',
      icon: 'log-out-outline',
      onPress: () => handleLogout(),
      color: '#ff4757',
    },
  ];

  const showSettingsModal = () => {
    Alert.alert(
      'Cài đặt',
      'Chọn cài đặt bạn muốn thay đổi',
      [
        { text: 'Thông báo', onPress: () => console.log('Notifications') },
        { text: 'Quyền riêng tư', onPress: () => console.log('Privacy') },
        { text: 'Tài khoản', onPress: () => console.log('Account') },
        { text: 'Hủy', style: 'cancel' },
      ]
    );
  };

  const showHelpModal = () => {
    Alert.alert(
      'Trợ giúp & Hỗ trợ',
      'Bạn cần hỗ trợ gì?',
      [
        { text: 'Câu hỏi thường gặp', onPress: () => console.log('FAQ') },
        { text: 'Liên hệ hỗ trợ', onPress: () => console.log('Contact Support') },
        { text: 'Báo cáo sự cố', onPress: () => console.log('Report Issue') },
        { text: 'Hủy', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 0 : insets.top }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 90 : 95 + insets.bottom }}
      >
        {/* Header */}
        <View style={[styles.header]}>
          <TouchableOpacity style={styles.settingsButton} onPress={showSettingsModal}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            {user.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
            )}
          </View>
          
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.bio}>{user.bio}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.stories}</Text>
              <Text style={styles.statLabel}>Stories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Người theo dõi</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Đang theo dõi</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareProfileButton}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* My Stories */}
        <View style={styles.storiesSection}>
          <Text style={styles.sectionTitle}>Stories của tôi</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {myStories.map((story) => (
              <TouchableOpacity key={story.id} style={styles.storyCard}>
                <Image source={{ uri: story.thumbnail }} style={styles.storyThumbnail} />
                <View style={styles.storyOverlay}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
                <View style={styles.storyInfo}>
                  <Text style={styles.storyTitle}>{story.title}</Text>
                  <View style={styles.storyStats}>
                    <Text style={styles.storyViews}>{story.views} views</Text>
                    <Text style={styles.storyLikes}>{story.likes} likes</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={item.color || '#fff'}
              />
              <Text style={[styles.menuText, { color: item.color || '#fff' }]}>
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Cài đặt nhanh</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color="#fff" />
              <Text style={styles.settingText}>Chế độ tối</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#333', true: '#007AFF' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <Text style={styles.settingText}>Thông báo</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#333', true: '#007AFF' }}
              thumbColor={notifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="play-outline" size={24} color="#fff" />
              <Text style={styles.settingText}>Tự động phát</Text>
            </View>
            <Switch
              value={autoPlay}
              onValueChange={setAutoPlay}
              trackColor={{ false: '#333', true: '#007AFF' }}
              thumbColor={autoPlay ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Metory v1.0.0</Text>
          <Text style={styles.appDescription}>
            Ứng dụng tạo và chia sẻ câu chuyện bằng video
          </Text>
        </View>
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareProfileButton: {
    width: 44,
    height: 44,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storiesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  storyCard: {
    width: 120,
    marginLeft: 20,
    position: 'relative',
  },
  storyThumbnail: {
    width: 120,
    height: 160,
    borderRadius: 12,
  },
  storyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyInfo: {
    marginTop: 8,
  },
  storyTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storyViews: {
    color: '#666',
    fontSize: 10,
  },
  storyLikes: {
    color: '#666',
    fontSize: 10,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  appVersion: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  appDescription: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ProfileScreen;
