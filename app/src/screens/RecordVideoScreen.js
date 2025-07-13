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
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import metoryApi from '../api/metoryApi';

const { width, height } = Dimensions.get('window');

const RecordVideoScreen = ({ navigation, route }) => {
  const { topic, questions } = route.params || { topic: 'Default Topic', questions: [] };
  const [permission, requestPermission] = useCameraPermissions();
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [cameraType, setCameraType] = useState('front');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedSegments, setRecordedSegments] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  
  const cameraRef = useRef(null);
  const questionFadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    getAudioPermissions();
  }, []);

  useEffect(() => {
    if (isRecording && isRecordingActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, isRecordingActive, isPaused]);

  const getAudioPermissions = async () => {
    const audioStatus = await Audio.requestPermissionsAsync();
    setHasAudioPermission(audioStatus.status === 'granted');
  };

  const handleRecord = async () => {
    if (!cameraRef.current) {
      Alert.alert('Lỗi', 'Camera chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }

    if (isRecording && isRecordingActive) {
      // Stop recording
      setIsRecording(false);
      setIsRecordingActive(false);
      
      try {
        const videoData = await cameraRef.current.stopRecording();
        console.log('Stop recording result:', videoData);
        
        // Check if videoData exists and has uri
        if (videoData && (videoData.uri || videoData.path)) {
          const videoUri = videoData.uri || videoData.path;
          
          setRecordedSegments(prev => [...prev, {
            questionIndex: currentQuestionIndex,
            videoUri: videoUri,
            duration: timer,
          }]);

          setTimer(0);
          
          // Move to next question or finish
          if (currentQuestionIndex < (questions.length || 1) - 1) {
            animateToNextQuestion();
          } else {
            handleFinishRecording();
          }
        } else {
          // Fallback: create a demo segment for testing
          console.warn('No video data received, creating demo segment');
          setRecordedSegments(prev => [...prev, {
            questionIndex: currentQuestionIndex,
            videoUri: 'demo_video_' + Date.now(),
            duration: timer,
          }]);

          setTimer(0);
          
          // Move to next question or finish
          if (currentQuestionIndex < (questions.length || 1) - 1) {
            animateToNextQuestion();
          } else {
            handleFinishRecording();
          }
        }
      } catch (error) {
        console.log('Error stopping recording:', error);
        setIsRecording(false);
        setIsRecordingActive(false);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi dừng quay video. Vui lòng thử lại.');
      }
    } else if (!isRecording && !isRecordingActive) {
      // Start recording
      try {
        setIsRecording(true);
        setIsRecordingActive(true);
        
        // Start recording asynchronously
        cameraRef.current.recordAsync({
          maxDuration: 60000, // 60 seconds max per segment
          quality: '720p',
        }).then((result) => {
          console.log('Recording completed:', result);
          // Recording completed automatically (due to maxDuration or manual stop)
        }).catch((error) => {
          console.log('Recording error:', error);
          setIsRecording(false);
          setIsRecordingActive(false);
        });
        
      } catch (error) {
        console.log('Error starting recording:', error);
        setIsRecording(false);
        setIsRecordingActive(false);
        Alert.alert('Lỗi', 'Không thể bắt đầu quay video. Vui lòng kiểm tra quyền camera.');
      }
    }
  };

  const animateToNextQuestion = () => {
    // Fade out current question
    Animated.timing(questionFadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Update progress
      Animated.timing(progressAnim, {
        toValue: (currentQuestionIndex + 1) / (questions.length || 1),
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Fade in new question
      Animated.timing(questionFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePause = () => {
    if (isRecording) {
      setIsPaused(!isPaused);
      // Note: CameraView in expo-camera v16 might not support pause/resume
      // This is a UI state change for now
    }
  };

  const handleFinishRecording = () => {
    Alert.alert(
      'Hoàn thành!',
      'Bạn đã quay xong tất cả câu hỏi. Tiếp tục để chỉnh sửa và chia sẻ.',
      [
        {
          text: 'Quay lại',
          style: 'cancel',
        },
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

  const handleUploadVideo = async (videoUri, storyId, questionId) => {
  try {
    setUploading(true);
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    const fileName = videoUri.split('/').pop();

    const uploadUrlResponse = await metoryApi.post(
      `/stories/${storyId}/upload-url`,
      { file_name: fileName } 
    );

    const { url, fields } = uploadUrlResponse.data; // Giả sử backend trả về thông tin này

    // Bước 2: Upload video thẳng lên Cloudflare R2
    // Dùng thư viện như 'react-native-background-upload' hoặc fetch API với FormData
    // Đây là bước quan trọng: video không đi qua server của bạn!
    const response = await FileSystem.uploadAsync(url, videoUri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        // fields này được trả về từ R2/S3
    });

    if (response.status === 204) { // Hoặc 200 tùy cấu hình R2
       console.log("Upload successful!");
       // Bước 3: Thông báo cho backend rằng video đã upload xong (tùy chọn)
       await metoryApi.post(`/stories/${storyId}/video-uploaded`, { questionId, videoUrl: '' });
    }

  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    setUploading(false);
  }
};

  const toggleCameraType = () => {
    setCameraType(
      cameraType === 'back' ? 'front' : 'back'
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permission || hasAudioPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Đang yêu cầu quyền truy cập...</Text>
      </View>
    );
  }

  if (!permission.granted || hasAudioPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Cần quyền truy cập camera và microphone để quay video
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
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
            {currentQuestionIndex + 1}/{questions.length || 1}
          </Text>
        </View>

        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
          <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Current Question */}
      <Animated.View
        style={[styles.questionContainer, { opacity: questionFadeAnim }]}
      >
        <Text style={styles.questionText}>
          {questions[currentQuestionIndex]?.text || 'Chưa có câu hỏi'}
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
        {/* Previous Question */}
        {currentQuestionIndex > 0 && !isRecording && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
              Animated.timing(progressAnim, {
                toValue: Math.max(0, currentQuestionIndex - 1) / (questions.length || 1),
                duration: 300,
                useNativeDriver: false,
              }).start();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Record Button */}
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordingButton,
            isPaused && styles.pausedButton,
          ]}
          onPress={handleRecord}
        >
          {isRecording ? (
            <View style={styles.stopIcon} />
          ) : (
            <View style={styles.recordIcon} />
          )}
        </TouchableOpacity>

        {/* Pause Button */}
        {isRecording && (
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Ionicons
              name={isPaused ? "play" : "pause"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        {/* Next Question */}
        {currentQuestionIndex < (questions.length || 1) - 1 && !isRecording && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              setCurrentQuestionIndex(prev => Math.min((questions.length || 1) - 1, prev + 1));
              Animated.timing(progressAnim, {
                toValue: Math.min((questions.length || 1) - 1, currentQuestionIndex + 1) / (questions.length || 1),
                duration: 300,
                useNativeDriver: false,
              }).start();
            }}
          >
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsText}>
          {isRecording
            ? isPaused
              ? "Nhấn play để tiếp tục quay"
              : "Nhấn nút đỏ để dừng và chuyển câu hỏi tiếp theo"
            : "Nhấn nút đỏ để bắt đầu quay"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    position: 'absolute',
    top: height * 0.15,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 16,
    padding: 20,
    zIndex: 1,
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  timerContainer: {
    position: 'absolute',
    top: height * 0.35,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordingButton: {
    backgroundColor: '#ff3838',
  },
  pausedButton: {
    backgroundColor: '#ffa502',
  },
  recordIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
  },
  pauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  tipsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  tipsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export default RecordVideoScreen;
