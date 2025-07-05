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
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const RecordVideoScreen = ({ navigation, route }) => {
  const { topic, questions } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedSegments, setRecordedSegments] = useState([]);
  const [timer, setTimer] = useState(0);
  
  const cameraRef = useRef(null);
  const questionFadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  const getPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const audioStatus = await Audio.requestPermissionsAsync();
    setHasPermission(cameraStatus.status === 'granted');
    setHasAudioPermission(audioStatus.status === 'granted');
  };

  const handleRecord = async () => {
    if (!cameraRef.current) return;

    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      const videoData = await cameraRef.current.stopRecording();
      
      setRecordedSegments([...recordedSegments, {
        questionIndex: currentQuestionIndex,
        videoUri: videoData.uri,
        duration: timer,
      }]);

      setTimer(0);
      
      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        animateToNextQuestion();
      } else {
        handleFinishRecording();
      }
    } else {
      // Start recording
      setIsRecording(true);
      const videoData = await cameraRef.current.recordAsync({
        quality: Camera.Constants.VideoQuality['720p'],
        maxDuration: 60, // 60 seconds max per segment
      });
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
        toValue: (currentQuestionIndex + 1) / questions.length,
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
      if (isPaused) {
        cameraRef.current?.resumeRecording();
      } else {
        cameraRef.current?.pauseRecording();
      }
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

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null || hasAudioPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Đang yêu cầu quyền truy cập...</Text>
      </View>
    );
  }

  if (hasPermission === false || hasAudioPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Cần quyền truy cập camera và microphone để quay video
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={getPermissions}>
          <Text style={styles.permissionButtonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        ratio="16:9"
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
            {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>

        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Current Question */}
      <Animated.View
        style={[styles.questionContainer, { opacity: questionFadeAnim }]}
      >
        <Text style={styles.questionText}>
          {questions[currentQuestionIndex]?.text}
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
                toValue: Math.max(0, currentQuestionIndex - 1) / questions.length,
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
        {currentQuestionIndex < questions.length - 1 && !isRecording && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
              Animated.timing(progressAnim, {
                toValue: Math.min(questions.length - 1, currentQuestionIndex + 1) / questions.length,
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
