import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActivityScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'likes', 'comments', 'follows'

  const activities = [
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Minh Anh',
        avatar: 'https://picsum.photos/100/100?random=1',
        verified: true,
      },
      story: {
        title: 'Chuyến đi Đà Lạt',
        thumbnail: 'https://picsum.photos/150/150?random=story1',
      },
      timestamp: '5 phút trước',
      isRead: false,
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Thu Hiền',
        avatar: 'https://picsum.photos/100/100?random=2',
        verified: false,
      },
      story: {
        title: 'Yoga buổi sáng',
        thumbnail: 'https://picsum.photos/150/150?random=story2',
      },
      comment: 'Video rất hữu ích! Cảm ơn bạn đã chia sẻ 💪',
      timestamp: '1 giờ trước',
      isRead: false,
    },
    {
      id: 3,
      type: 'follow',
      user: {
        name: 'Chef Huy',
        avatar: 'https://picsum.photos/100/100?random=3',
        verified: true,
      },
      timestamp: '2 giờ trước',
      isRead: true,
    },
    {
      id: 4,
      type: 'like',
      user: {
        name: 'Lan Phương',
        avatar: 'https://picsum.photos/100/100?random=4',
        verified: false,
      },
      story: {
        title: 'Món phở bò truyền thống',
        thumbnail: 'https://picsum.photos/150/150?random=story3',
      },
      timestamp: '3 giờ trước',
      isRead: true,
    },
    {
      id: 5,
      type: 'comment',
      user: {
        name: 'Văn Đức',
        avatar: 'https://picsum.photos/100/100?random=5',
        verified: false,
      },
      story: {
        title: 'Coding tips for beginners',
        thumbnail: 'https://picsum.photos/150/150?random=story4',
      },
      comment: 'Hay quá! Mình đang học lập trình nên rất cần những tips này',
      timestamp: '1 ngày trước',
      isRead: true,
    },
  ];

  const getFilteredActivities = () => {
    if (activeTab === 'all') return activities;
    return activities.filter(activity => activity.type === activeTab || 
      (activeTab === 'follows' && activity.type === 'follow'));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'like':
        return { name: 'heart', color: '#ff4757' };
      case 'comment':
        return { name: 'chatbubble', color: '#007AFF' };
      case 'follow':
        return { name: 'person-add', color: '#2ed573' };
      default:
        return { name: 'notifications', color: '#666' };
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'like':
        return `đã thích story "${activity.story.title}" của bạn`;
      case 'comment':
        return `đã bình luận về story "${activity.story.title}" của bạn`;
      case 'follow':
        return 'đã bắt đầu theo dõi bạn';
      default:
        return 'có hoạt động mới';
    }
  };

  const renderActivityItem = ({ item }) => {
    const icon = getActivityIcon(item.type);
    
    return (
      <TouchableOpacity style={[styles.activityItem, !item.isRead && styles.unreadActivity]}>
        <View style={styles.activityLeft}>
          <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
          <View style={[styles.activityIcon, { backgroundColor: icon.color }]}>
            <Ionicons name={icon.name} size={12} color="#fff" />
          </View>
        </View>

        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.user.name}</Text>
              {item.user.verified && (
                <Ionicons name="checkmark-circle" size={14} color="#007AFF" />
              )}
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>

          <Text style={styles.activityText}>
            {getActivityText(item)}
          </Text>

          {item.comment && (
            <View style={styles.commentContainer}>
              <Text style={styles.commentText}>"{item.comment}"</Text>
            </View>
          )}
        </View>

        {item.story && (
          <Image source={{ uri: item.story.thumbnail }} style={styles.storyThumbnail} />
        )}

        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  const tabs = [
    { key: 'all', label: 'Tất cả', count: activities.length },
    { key: 'likes', label: 'Thích', count: activities.filter(a => a.type === 'like').length },
    { key: 'comments', label: 'Bình luận', count: activities.filter(a => a.type === 'comment').length },
    { key: 'follows', label: 'Theo dõi', count: activities.filter(a => a.type === 'follow').length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hoạt động</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activity List */}
      <FlatList
        data={getFilteredActivities()}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Empty State */}
      {getFilteredActivities().length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>Chưa có hoạt động nào</Text>
          <Text style={styles.emptyDescription}>
            Khi có người tương tác với stories của bạn, chúng sẽ xuất hiện ở đây
          </Text>
        </View>
      )}
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#0a0a0a',
    position: 'relative',
  },
  unreadActivity: {
    backgroundColor: '#1a1a1a',
  },
  activityLeft: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  activityIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  activityText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 18,
  },
  commentContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  commentText: {
    color: '#ccc',
    fontSize: 12,
    fontStyle: 'italic',
  },
  storyThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ActivityScreen;
