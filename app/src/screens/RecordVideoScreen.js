import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system'; // Cần thiết cho hàm upload
import metoryApi from '../api/metoryApi';

const { width, height } = Dimensions.get('window');

const RecordVideoScreen = ({ navigation, route }) => {
  const { topic, questions = [] } = route.params || { topic: 'Default Topic' };
  const [permission, requestPermission] = useCameraPermissions();
  
  // State đã được đơn giản hóa
  const [cameraType, setCameraType] = useState('front');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Vẫn giữ để xử lý UI pause
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedSegments, setRecordedSegments] = useState([]);
  const [timer, setTimer] = useState(0);
  const [uploading, setUploading] = useState(false); // Thêm state cho việc upload

  const cameraRef = useRef(null);
  const questionFadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    // Không cần hàm getAudioPermissions riêng nữa vì useCameraPermissions đã xử lý cả mic
    // useEffect này để xử lý timer
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  const handleRecord = async () => {
    if (!cameraRef.current) {
      Alert.alert('Lỗi', 'Camera chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }

    if (isRecording) {
      // Dừng quay phim
      setIsRecording(false);
      try {
        const videoData = await cameraRef.current.stopRecording();
        
        if (videoData && videoData.uri) {
          console.log('Video đã được quay tại:', videoData.uri);
          setRecordedSegments(prev => [...prev, {
            questionIndex: currentQuestionIndex,
            videoUri: videoData.uri,
            duration: timer,
          }]);

          setTimer(0);
          
          if (currentQuestionIndex < (questions.length || 1) - 1) {
            animateToNextQuestion();
          } else {
            handleFinishRecording();
          }
        } else {
          console.warn('Không nhận được dữ liệu video sau khi dừng.');
          Alert.alert('Lỗi', 'Không thể lưu video vừa quay. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Lỗi khi dừng quay video:', error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi dừng quay video.');
      }
    } else {
      // Bắt đầu quay phim
      setIsRecording(true);
      setIsPaused(false); // Reset trạng thái pause khi bắt đầu lần quay mới
      
      try {
        // recordAsync sẽ trả về một promise, resolve khi stopRecording được gọi
        cameraRef.current.recordAsync({
          quality: '720p',
        }).then(data => {
            // Promise này sẽ resolve khi video được dừng
            // Logic xử lý video đã được chuyển vào phần `stopRecording` ở trên
        }).catch(error => {
            console.error("Lỗi trong quá trình quay:", error);
            setIsRecording(false);
            Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình quay.');
        });
      } catch (error) {
        console.error('Lỗi khi bắt đầu quay video:', error);
        setIsRecording(false);
        Alert.alert('Lỗi', 'Không thể bắt đầu quay video.');
      }
    }
  };
  
  const animateToNextQuestion = () => {
    Animated.timing(questionFadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      Animated.timing(progressAnim, {
        toValue: nextIndex / (questions.length || 1),
        duration: 300,
        useNativeDriver: false,
      }).start();

      questionFadeAnim.setValue(1); // Reset animation thay vì tạo animation mới
    });
  };

  const handlePause = () => {
    if (isRecording) {
      setIsPaused(!isPaused);
      // Ghi chú: CameraView hiện tại có thể không hỗ trợ pause/resume record,
      // đây chỉ là thay đổi trạng thái UI để ngưng timer.
      // Nếu cần pause thật, cần kiểm tra API `cameraRef.current.pauseRecording()` (nếu có)
    }
  };

  const handleFinishRecording = () => {
    Alert.alert(
      'Hoàn thành!',
      'Bạn đã quay xong tất cả câu hỏi. Tiếp tục để chỉnh sửa và chia sẻ.',
      [
        { text: 'Quay lại', style: 'cancel' },
        {
          text: 'Tiếp tục',
          onPress: () => navigation.navigate('EditStory', {
            topic,
            questions,
            recordedSegments,
          }),
        },
      ]
    );
  };
  
  // Hàm này chưa được gọi trong component, nhưng đã được sửa lỗi
  const handleUploadVideo = async (videoUri, storyId, questionId) => {
    try {
      setUploading(true);
      const fileName = videoUri.split('/').pop();

      // Giả sử API trả về URL đã ký để upload
      const uploadUrlResponse = await metoryApi.post(
        `/stories/${storyId}/upload-url`, { file_name: fileName }
      );
      const { url } = uploadUrlResponse.data;

      const response = await FileSystem.uploadAsync(url, videoUri, {
        httpMethod: 'PUT', // Hoặc POST tùy vào yêu cầu của R2/S3
        headers: { 'Content-Type': 'video/mp4' },
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("Upload thành công!");
        await metoryApi.post(`/stories/${storyId}/video-uploaded`, { questionId, videoUrl: url.split('?')[0] });
      } else {
        throw new Error('Upload to storage failed');
      }
    } catch (error) {
      console.error("Upload thất bại:", error);
      Alert.alert('Lỗi', 'Upload video thất bại.');
    } finally {
      setUploading(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Gộp các điều kiện kiểm tra quyền
  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Đang yêu cầu quyền truy cập...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Metory cần quyền truy cập camera và microphone để quay video.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- RENDER ---
  const totalQuestions = questions.length || 1;

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        mode="video"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.min(currentQuestionIndex + 1, totalQuestions)}/{totalQuestions}
          </Text>
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={toggleCameraType}>
          <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Current Question */}
      <Animated.View style={[styles.questionContainer, { opacity: questionFadeAnim }]}>
        <Text style={styles.questionText}>
          {questions[currentQuestionIndex]?.text || 'Ghi âm tự do'}
        </Text>
      </Animated.View>

      {/* Timer */}
      {isRecording && (
        <View style={styles.timerContainer}>
          <View style={styles.recordingIndicator} />
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        {/* Placeholder để giữ nút record ở giữa */}
        <View style={{ width: 50 }} />
        
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={handleRecord}
        >
          {isRecording ? (
            <View style={styles.stopIcon} />
          ) : (
            <View style={styles.recordIcon} />
          )}
        </TouchableOpacity>

        {/* Nút Pause chỉ hiện khi đang quay và chưa pause */}
        {isRecording && !isPaused ? (
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Ionicons name="pause" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>

      {/* Bottom Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsText}>
          {isRecording
            ? isPaused
              ? "Nhấn nút quay để tiếp tục" // Logic pause hiện tại chưa hỗ trợ resume
              : "Nhấn nút đỏ để dừng và chuyển câu hỏi"
            : "Nhấn nút đỏ để bắt đầu quay"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

// --- STYLES (giữ nguyên, thêm/sửa một vài style) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  permissionContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  permissionText: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  permissionButton: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  permissionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  header: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, zIndex: 1 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  progressContainer: { flex: 1, alignItems: 'center', marginHorizontal: 15 },
  progressBar: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 2 },
  progressText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  questionContainer: { position: 'absolute', top: height * 0.15, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 16, padding: 20, zIndex: 1, marginHorizontal: 20 },
  questionText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', lineHeight: 24 },
  timerContainer: { position: 'absolute', top: height * 0.30, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, zIndex: 1 },
  recordingIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', marginRight: 8 },
  timerText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  controls: { position: 'absolute', bottom: 120, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 40, zIndex: 1 },
  recordButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  recordingButton: { backgroundColor: '#ff4757' },
  recordIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#ff4757', borderWidth: 3, borderColor: '#000' },
  stopIcon: { width: 28, height: 28, borderRadius: 4, backgroundColor: '#fff' },
  pauseButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  tipsContainer: { position: 'absolute', bottom: 40, left: 20, right: 20, zIndex: 1 },
  tipsText: { color: '#fff', fontSize: 14, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
});

export default RecordVideoScreen;