// src/screens/InteractionScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator, Image, Keyboard, FlatList
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const HEADER_HEIGHT = 60; // Chiều cao ước tính của header

const InteractionScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const { metoryData, user } = story;
  const insets = useSafeAreaInsets(); // Hook để lấy vùng an toàn

  // State quản lý video
  const [currentVideo, setCurrentVideo] = useState(metoryData[0]);
  const [nextVideo, setNextVideo] = useState(null);
  const [isFading, setIsFading] = useState(false);

  // State quản lý chat
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Refs cho video player
  const videoPlayer1 = useRef(null);
  const videoPlayer2 = useRef(null);

  // Hàm giả lập AI tìm video trả lời
  const findMatchingVideo = (question) => {
    const keywords = question.toLowerCase().split(' ');
    for (const data of metoryData) {
      if (keywords.some(keyword => data.question.toLowerCase().includes(keyword))) {
        if(data.videoUrl !== currentVideo.videoUrl) return data;
      }
    }
    return null; // Không tìm thấy video phù hợp
  };

  const handleSend = () => {
    if (!input.trim() || isThinking) return;

    const userQuestion = input;
    setMessages(prev => [{ id: Date.now().toString(), type: 'user', text: userQuestion }, ...prev]);
    setInput('');
    Keyboard.dismiss();
    setIsThinking(true);

    // Giả lập AI xử lý
    setTimeout(() => {
      const matchedVideo = findMatchingVideo(userQuestion);
      setIsThinking(false);

      if (matchedVideo) {
        setNextVideo(matchedVideo);
        setIsFading(true);
        setTimeout(() => {
          setCurrentVideo(matchedVideo);
          setNextVideo(null);
          setIsFading(false);
        }, 500);
      } else {
        setMessages(prev => [{ id: Date.now().toString(), type: 'bot', text: "Mình không có ký ức nào về điều đó..." }, ...prev]);
      }
    }, 1500);
  };

  const renderMessageItem = ({ item }) => {
    if (item.type === 'thinking') {
       return <ActivityIndicator color="#fff" style={styles.thinkingIndicator} />;
    }
    return (
      <View style={item.type === 'user' ? styles.userMessageContainer : styles.botMessageContainer}>
          <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  useEffect(() => {
    if (isThinking) {
      setMessages(prev => [{ id: 'thinking', type: 'thinking' }, ...prev]);
    } else {
      setMessages(prev => prev.filter(msg => msg.type !== 'thinking'));
    }
  }, [isThinking]);


  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Video Player 1 (Video chính) */}
      <Video
        ref={videoPlayer1}
        style={[styles.video, { opacity: isFading ? 0 : 1 }]}
        source={{ uri: currentVideo.videoUrl }}
        resizeMode="cover"
        shouldPlay={true}
        isLooping
      />
      {/* Video Player 2 (Dùng để chuyển cảnh) */}
      {nextVideo && (
        <Video
          ref={videoPlayer2}
          style={[styles.video, { opacity: isFading ? 1 : 0 }]}
          source={{ uri: nextVideo.videoUrl }}
          resizeMode="cover"
          shouldPlay={true}
          isLooping
        />
      )}

      {/* Giao diện người dùng */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
             <View style={styles.userInfo}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <Text style={styles.userName}>{user.name}</Text>
            </View>
            <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
        </View>

        {/* Bàn phím và input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : HEADER_HEIGHT}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
             {/* Sử dụng FlatList inverted cho hiệu năng tốt nhất */}
            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              inverted
            />
          </View>
          
          <View style={[styles.inputContainerWrapper, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
            <BlurView intensity={50} tint="dark" style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder={`Hỏi ${user.name} điều gì đó...`}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
                 <TouchableOpacity 
                    style={[styles.micButton, isRecording && styles.micButtonRecording]}
                    onPressIn={() => setIsRecording(true)}
                    onPressOut={() => setIsRecording(false)}
                 >
                    <Ionicons name="mic" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!input.trim() || isThinking}>
                    <Ionicons name="arrow-up-circle" size={34} color={input.trim() ? "#007AFF" : "#8e8e93"} />
                </TouchableOpacity>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    video: { ...StyleSheet.absoluteFillObject, transition: 'opacity 0.5s ease-in-out' },
    overlay: { flex: 1, ...StyleSheet.absoluteFillObject },
    header: { height: HEADER_HEIGHT, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, width: '100%'},
    headerButton: { padding: 8 },
    userInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
    userName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    keyboardView: { flex: 1, justifyContent: 'flex-end'},
    messageList: { flex: 1, paddingHorizontal: 16 },
    messageListContent: { paddingTop: 10, flexDirection: 'column-reverse' },
    userMessageContainer: { alignSelf: 'flex-end', backgroundColor: '#007AFF', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8, maxWidth: '80%' },
    botMessageContainer: { alignSelf: 'flex-start', backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8, maxWidth: '80%' },
    messageText: { color: '#fff', fontSize: 15, lineHeight: 20 },
    thinkingIndicator: { alignSelf: 'flex-start', marginBottom: 8, marginLeft: 10},
    inputContainerWrapper: { width: '100%', paddingHorizontal: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 25, overflow: 'hidden', paddingLeft: 4, paddingRight: 4, paddingVertical: 4 },
    input: { flex: 1, color: '#fff', fontSize: 16, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 10 : 6, marginRight: 4 },
    micButton: { padding: 8, marginRight: 4 },
    micButtonRecording: { backgroundColor: 'rgba(255, 0, 0, 0.5)', borderRadius: 20},
    sendButton: {},
});

export default InteractionScreen;