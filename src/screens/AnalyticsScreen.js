import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days'); // '7days', '30days', '90days'

  const analyticsData = {
    '7days': {
      totalViews: 12500,
      totalLikes: 890,
      totalComments: 156,
      totalShares: 89,
      followers: 1250,
      engagement: 7.2,
      topStory: 'Chuyến đi Đà Lạt',
      topStoryViews: 3200,
    },
    '30days': {
      totalViews: 45600,
      totalLikes: 3240,
      totalComments: 578,
      totalShares: 312,
      followers: 1250,
      engagement: 8.5,
      topStory: 'Yoga buổi sáng',
      topStoryViews: 8900,
    },
    '90days': {
      totalViews: 125400,
      totalLikes: 8970,
      totalComments: 1423,
      totalShares: 856,
      followers: 1250,
      engagement: 9.1,
      topStory: 'Món phở bò truyền thống',
      topStoryViews: 15600,
    },
  };

  const currentData = analyticsData[selectedPeriod];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case '7days':
        return '7 ngày qua';
      case '30days':
        return '30 ngày qua';
      case '90days':
        return '90 ngày qua';
      default:
        return '7 ngày qua';
    }
  };

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color="#fff" />
        </View>
        <View style={styles.statChange}>
          {change && (
            <>
              <Ionicons 
                name={changeType === 'up' ? 'trending-up' : 'trending-down'} 
                size={12} 
                color={changeType === 'up' ? '#2ed573' : '#ff4757'} 
              />
              <Text style={[styles.changeText, { color: changeType === 'up' ? '#2ed573' : '#ff4757' }]}>
                {change}%
              </Text>
            </>
          )}
        </View>
      </View>
      <Text style={styles.statValue}>{formatNumber(value)}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const periods = [
    { key: '7days', label: '7 ngày' },
    { key: '30days', label: '30 ngày' },
    { key: '90days', label: '90 ngày' },
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
        <Text style={styles.headerTitle}>Phân tích</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSection}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <View style={styles.periodButtons}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.activePeriodButton
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.activePeriodButtonText
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Overview Stats */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Tổng quan {getPeriodLabel(selectedPeriod)}</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Lượt xem"
              value={currentData.totalViews}
              icon="eye"
              color="#007AFF"
              change={12.5}
              changeType="up"
            />
            <StatCard
              title="Lượt thích"
              value={currentData.totalLikes}
              icon="heart"
              color="#ff4757"
              change={8.3}
              changeType="up"
            />
            <StatCard
              title="Bình luận"
              value={currentData.totalComments}
              icon="chatbubble"
              color="#2ed573"
              change={15.7}
              changeType="up"
            />
            <StatCard
              title="Chia sẻ"
              value={currentData.totalShares}
              icon="share"
              color="#ffa502"
              change={-2.1}
              changeType="down"
            />
          </View>
        </View>

        {/* Engagement Rate */}
        <View style={styles.engagementSection}>
          <Text style={styles.sectionTitle}>Tỷ lệ tương tác</Text>
          <View style={styles.engagementCard}>
            <View style={styles.engagementValue}>
              <Text style={styles.engagementPercent}>{currentData.engagement}%</Text>
              <View style={styles.engagementChange}>
                <Ionicons name="trending-up" size={16} color="#2ed573" />
                <Text style={styles.engagementChangeText}>+1.2%</Text>
              </View>
            </View>
            <Text style={styles.engagementDescription}>
              Tỷ lệ người xem tương tác với nội dung của bạn
            </Text>
            <View style={styles.engagementBar}>
              <View style={[styles.engagementFill, { width: `${currentData.engagement * 10}%` }]} />
            </View>
          </View>
        </View>

        {/* Top Performing Story */}
        <View style={styles.topStorySection}>
          <Text style={styles.sectionTitle}>Story xuất sắc nhất</Text>
          <View style={styles.topStoryCard}>
            <View style={styles.topStoryInfo}>
              <Text style={styles.topStoryTitle}>{currentData.topStory}</Text>
              <Text style={styles.topStoryViews}>
                {formatNumber(currentData.topStoryViews)} lượt xem
              </Text>
            </View>
            <TouchableOpacity style={styles.viewStoryButton}>
              <Text style={styles.viewStoryButtonText}>Xem chi tiết</Text>
              <Ionicons name="chevron-forward" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Growth Metrics */}
        <View style={styles.growthSection}>
          <Text style={styles.sectionTitle}>Tăng trưởng</Text>
          <View style={styles.growthCards}>
            <View style={styles.growthCard}>
              <View style={styles.growthHeader}>
                <Ionicons name="people" size={24} color="#007AFF" />
                <Text style={styles.growthValue}>+{formatNumber(85)}</Text>
              </View>
              <Text style={styles.growthTitle}>Người theo dõi mới</Text>
              <Text style={styles.growthSubtitle}>{getPeriodLabel(selectedPeriod)}</Text>
            </View>

            <View style={styles.growthCard}>
              <View style={styles.growthHeader}>
                <Ionicons name="trending-up" size={24} color="#2ed573" />
                <Text style={styles.growthValue}>+{formatNumber(256)}</Text>
              </View>
              <Text style={styles.growthTitle}>Tương tác mới</Text>
              <Text style={styles.growthSubtitle}>{getPeriodLabel(selectedPeriod)}</Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb" size={20} color="#ffa502" />
              <Text style={styles.insightTitle}>Gợi ý cải thiện</Text>
            </View>
            <Text style={styles.insightText}>
              Stories về chủ đề "Du lịch" của bạn nhận được nhiều tương tác nhất. 
              Hãy tạo thêm nội dung tương tự để tăng engagement rate.
            </Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="time" size={20} color="#007AFF" />
              <Text style={styles.insightTitle}>Thời gian tối ưu</Text>
            </View>
            <Text style={styles.insightText}>
              Khán giả của bạn hoạt động nhiều nhất vào khoảng 19:00 - 21:00. 
              Đăng stories vào thời gian này để tối ưu lượt xem.
            </Text>
          </View>
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
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  periodSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activePeriodButtonText: {
    color: '#fff',
  },
  overviewSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  engagementSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  engagementCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
  },
  engagementValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  engagementPercent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
  },
  engagementChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementChangeText: {
    color: '#2ed573',
    fontSize: 14,
    fontWeight: 'bold',
  },
  engagementDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
  },
  engagementBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  engagementFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  topStorySection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  topStoryCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  topStoryInfo: {
    marginBottom: 16,
  },
  topStoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  topStoryViews: {
    fontSize: 14,
    color: '#666',
  },
  viewStoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  viewStoryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  growthSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  growthCards: {
    flexDirection: 'row',
    gap: 12,
  },
  growthCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  growthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  growthValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  growthTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  growthSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  insightsSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    paddingBottom: 40,
  },
  insightCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
});

export default AnalyticsScreen;
