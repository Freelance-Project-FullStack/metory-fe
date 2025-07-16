import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CreateStoryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    { id: 1, title: 'Du lịch', icon: 'airplane', color: '#ff6b6b' },
    { id: 2, title: 'Ẩm thực', icon: 'restaurant', color: '#4ecdc4' },
    { id: 3, title: 'Thể thao', icon: 'football', color: '#45b7d1' },
    { id: 4, title: 'Công nghệ', icon: 'phone-portrait', color: '#96ceb4' },
    { id: 5, title: 'Âm nhạc', icon: 'musical-notes', color: '#feca57' },
    { id: 6, title: 'Phim ảnh', icon: 'videocam', color: '#ff9ff3' },
    { id: 7, title: 'Sách', icon: 'book', color: '#54a0ff' },
    { id: 8, title: 'Thời trang', icon: 'shirt', color: '#5f27cd' },
    { id: 9, title: 'Sức khỏe', icon: 'fitness', color: '#00d2d3' },
    { id: 10, title: 'Giáo dục', icon: 'school', color: '#ff6348' },
    { id: 11, title: 'Kinh doanh', icon: 'briefcase', color: '#2f3640' },
    { id: 12, title: 'Gia đình', icon: 'home', color: '#f368e0' },
  ];

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleGenerateQuestions = () => {
    if (!selectedTopic) {
      Alert.alert('Thông báo', 'Vui lòng chọn một chủ đề');
      return;
    }

    navigation.navigate('QuestionSelection', { topic: selectedTopic });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo Story</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 90 : 95 + insets.bottom }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn chủ đề</Text>
          <Text style={styles.sectionSubtitle}>
            AI sẽ tạo bộ câu hỏi phù hợp với chủ đề bạn chọn
          </Text>
        </View>

        <View style={styles.topicsGrid}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicCard,
                { backgroundColor: topic.color },
                selectedTopic?.id === topic.id && styles.selectedTopic,
              ]}
              onPress={() => handleTopicSelect(topic)}
            >
              <Ionicons name={topic.icon} size={32} color="#fff" />
              <Text style={styles.topicTitle}>{topic.title}</Text>
              {selectedTopic?.id === topic.id && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.instructionContainer}>
          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepText}>1</Text>
            </View>
            <Text style={styles.instructionText}>Chọn chủ đề yêu thích</Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepText}>2</Text>
            </View>
            <Text style={styles.instructionText}>AI tạo bộ câu hỏi thú vị</Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepText}>3</Text>
            </View>
            <Text style={styles.instructionText}>Chọn và chỉnh sửa câu hỏi</Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepText}>4</Text>
            </View>
            <Text style={styles.instructionText}>Quay video và chia sẻ</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedTopic && styles.disabledButton,
          ]}
          onPress={handleGenerateQuestions}
          disabled={!selectedTopic}
        >
          <Text style={styles.continueButtonText}>Tạo câu hỏi</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
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
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  topicCard: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  selectedTopic: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  topicTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  footer: {
    padding: 20
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default CreateStoryScreen;
