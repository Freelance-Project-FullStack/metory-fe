import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import metoryApi from '../api/metoryApi'; // Giả sử đây là instance của Axios

const EditStoryScreen = ({ navigation, route }) => {
  const { topic, questions, recordedSegments: initialSegments } = route.params;
  const [segments, setSegments] = useState(initialSegments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReorder = ({ data }) => {
    setSegments(data);
  };

  const handleDeleteSegment = (videoUri) => {
    Alert.alert('Xóa phân đoạn', 'Bạn có chắc chắn muốn xóa video này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => setSegments(segments.filter(seg => seg.videoUri !== videoUri)),
      },
    ]);
  };

  /**
   * Hàm xử lý đăng story đã được viết lại hoàn toàn.
   * Client chỉ cần gom dữ liệu và gửi 1 lần duy nhất.
   */
  const handleSubmitStory = async () => {
    if (segments.length === 0) {
      Alert.alert('Lỗi', 'Bạn cần có ít nhất một video để đăng story.');
      return;
    }

    setIsSubmitting(true);

    // BƯỚC 1: Tạo đối tượng FormData
    const formData = new FormData();

    // BƯỚC 2: Thêm các thông tin dạng text
    formData.append('title', topic.title || 'My Story');

    // Chuẩn bị dữ liệu cho các phân đoạn dưới dạng JSON string
    const segmentsMetadata = segments.map(seg => ({
      // Sử dụng questionIndex hoặc một ID câu hỏi thật nếu có
      question_id: seg.questionIndex,
      duration: seg.duration,
    }));
    formData.append('segments', JSON.stringify(segmentsMetadata));

    // BƯỚC 3: Thêm các file video
    // Tên file và type rất quan trọng để backend xử lý
    segments.forEach((segment, index) => {
      formData.append('videos', {
        uri: segment.videoUri,
        name: `video_${index}.mp4`,
        type: 'video/mp4',
      });
    });

    try {
      // BƯỚC 4: Gửi request multipart/form-data
      // Header 'Content-Type': 'multipart/form-data' sẽ được Axios tự động thêm
      // khi bạn truyền một đối tượng FormData.
      const response = await metoryApi.post('/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Thêm onUploadProgress để theo dõi tiến trình upload (tùy chọn)
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Uploading... ${percentCompleted}%`);
        },
      });

      // BƯỚC 5: Xử lý kết quả
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Thành công!', 'Story của bạn đã được đăng.', [
          { text: 'Tuyệt vời!', onPress: () => navigation.navigate('Home') },
        ]);
      } else {
        throw new Error('Server trả về lỗi.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng story:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi đăng story. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item, drag, isActive }) => (
    <TouchableOpacity
      style={[styles.segmentItem, { backgroundColor: isActive ? '#333' : '#1a1a1a' }]}
      onLongPress={drag}
      disabled={isActive}
    >
      <Video source={{ uri: item.videoUri }} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.segmentInfo}>
        <Text style={styles.questionText} numberOfLines={2}>
          {questions.find(q => q.id === item.questionIndex)?.text || 'Video tự do'}
        </Text>
        <Text style={styles.durationText}>Thời lượng: {item.duration}s</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteSegment(item.videoUri)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color="#ff4757" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa & Đăng</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tipContainer}>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
        <Text style={styles.tipText}>Giữ và kéo để sắp xếp lại thứ tự các video.</Text>
      </View>

      {isSubmitting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Đang đăng story của bạn...</Text>
          <Text style={styles.loadingSubText}>Vui lòng không thoát ứng dụng.</Text>
        </View>
      ) : (
        <DraggableFlatList
          data={segments}
          renderItem={renderItem}
          keyExtractor={(item) => item.videoUri}
          onDragEnd={handleReorder}
          containerStyle={{ flex: 1 }}
        />
      )}

      {!isSubmitting && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitStory}>
            <Text style={styles.submitButtonText}>Đăng Story</Text>
            <Ionicons name="rocket-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backButton: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  tipContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 12, marginHorizontal: 16, borderRadius: 8, marginBottom: 16 },
  tipText: { color: '#ccc', fontSize: 14, marginLeft: 8 },
  segmentItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, marginBottom: 12, borderRadius: 8 },
  thumbnail: { width: 60, height: 80, borderRadius: 6, backgroundColor: '#333' },
  segmentInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  questionText: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  durationText: { color: '#888', fontSize: 12 },
  deleteButton: { padding: 8 },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#1a1a1a' },
  submitButton: { backgroundColor: '#007AFF', borderRadius: 12, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { color: '#fff', marginTop: 16, fontSize: 18, fontWeight: 'bold' },
  loadingSubText: { color: '#aaa', marginTop: 8, fontSize: 14 }
});

export default EditStoryScreen;