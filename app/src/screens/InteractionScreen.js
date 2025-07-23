import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Keyboard,
  FlatList,
  Animated,
  Dimensions,
  ScrollView
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const HEADER_HEIGHT = 60;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const InteractionScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const { metoryData, user } = story;
  const insets = useSafeAreaInsets();

  // State quản lý video
  const [currentVideo, setCurrentVideo] = useState(metoryData[0]);
  const [nextVideo, setNextVideo] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isFading, setIsFading] = useState(false);

  // State quản lý chat
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", type: "bot", text: `Xin chào! Tôi là ${user.name}, bạn muốn hỏi gì về chủ đề này?` }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Refs
  const videoPlayer1 = useRef(null);
  const videoPlayer2 = useRef(null);
  const flatListRef = useRef(null);

  // Tổ chức câu hỏi theo chủ đề
  const getQuestionsByCategory = () => {
    const categories = {};
    metoryData.forEach(item => {
      const category = item.category || 'Khác';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    return categories;
  };

  // Hàm chuyển video mượt mà
  const transitionToVideo = (selectedData) => {
    setShowHints(false);
    setNextVideo(selectedData);
    setIsFading(true);
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentVideo(selectedData);
      setNextVideo(null);
      fadeAnim.setValue(1);
      setIsFading(false);
    });
  };

  // Hàm giả lập AI tìm video trả lời
  const findMatchingVideo = (question) => {
    const keywords = question.toLowerCase().split(" ");
    for (const data of metoryData) {
      if (keywords.some(keyword => 
        data.question.toLowerCase().includes(keyword) ||
        data.keywords?.some(k => k.toLowerCase().includes(keyword))
      )) {
        if (data.videoUrl !== currentVideo.videoUrl) return data;
      }
    }
    return null;
  };

  const handleSend = () => {
    if (!input.trim() || isThinking) return;

    const userQuestion = input;
    setMessages(prev => [
      { id: Date.now().toString(), type: "user", text: userQuestion },
      ...prev
    ]);
    setInput("");
    Keyboard.dismiss();
    setIsThinking(true);

    // Giả lập AI xử lý
    setTimeout(() => {
      const matchedVideo = findMatchingVideo(userQuestion);
      setIsThinking(false);

      if (matchedVideo) {
        setMessages(prev => [
          { 
            id: Date.now().toString(), 
            type: "bot", 
            text: `Tôi có câu trả lời cho bạn: "${matchedVideo.question}"`
          },
          ...prev
        ]);
        transitionToVideo(matchedVideo);
      } else {
        setMessages(prev => [
          {
            id: Date.now().toString(),
            type: "bot",
            text: "Tôi chưa có thông tin về điều này. Bạn có thể hỏi về chủ đề khác?",
          },
          ...prev
        ]);
      }
    }, 1500);
  };

  const renderMessageItem = ({ item }) => {
    if (item.type === "thinking") {
      return (
        <View style={styles.messageContainer}>
          <ActivityIndicator color="#fff" size="small" style={styles.thinkingIcon} />
          <Text style={styles.thinkingText}>Đang tìm câu trả lời...</Text>
        </View>
      );
    }
    
    return (
      <View
        style={[
          styles.messageContainer,
          item.type === "user" ? styles.userMessage : styles.botMessage
        ]}
      >
        {item.type === "bot" && (
          <Image source={{ uri: user.avatar }} style={styles.messageAvatar} />
        )}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (isThinking) {
      setMessages(prev => [{ id: "thinking", type: "thinking" }, ...prev]);
    } else {
      setMessages(prev => prev.filter(msg => msg.type !== "thinking"));
    }
  }, [isThinking]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Video Player 1 (Video chính) */}
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <Video
          ref={videoPlayer1}
          style={styles.video}
          source={{ uri: currentVideo.videoUrl }}
          resizeMode="cover"
          shouldPlay={true}
          isLooping
          isMuted={false}
        />
      </Animated.View>
      
      {/* Video Player 2 (Dùng để chuyển cảnh) */}
      {nextVideo && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: Animated.subtract(1, fadeAnim) }]}>
          <Video
            ref={videoPlayer2}
            style={styles.video}
            source={{ uri: nextVideo.videoUrl }}
            resizeMode="cover"
            shouldPlay={true}
            isLooping
            isMuted={false}
          />
        </Animated.View>
      )}

      {/* Giao diện người dùng */}
      <View style={styles.overlay}>
        {/* Header */}
        <BlurView intensity={80} tint="dark" style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowHints(!showHints)}
          >
            <Ionicons name={showHints ? "close" : "bulb"} size={24} color="#fff" />
          </TouchableOpacity>
        </BlurView>

        {/* Gợi ý câu hỏi theo chủ đề */}
        {showHints && (
          <View style={styles.hintsContainer}>
            <BlurView intensity={100} tint="dark" style={styles.hintsBlur}>
              <Text style={styles.hintsTitle}>Khám phá chủ đề</Text>
              <ScrollView style={styles.hintsScroll}>
                {Object.entries(getQuestionsByCategory()).map(([category, questions]) => (
                  <View key={category} style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <View style={styles.hintsGrid}>
                      {questions.map((item, index) => (
                        <TouchableOpacity
                          key={`${category}-${index}`}
                          style={styles.hintItem}
                          onPress={() => transitionToVideo(item)}
                        >
                          <Ionicons name="play" size={16} color="#fff" style={styles.playIcon} />
                          <Text style={styles.hintText}>{item.question}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </BlurView>
          </View>
        )}

        {/* Chat interface */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : HEADER_HEIGHT}
        >
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              inverted
              onContentSizeChange={() => flatListRef.current?.scrollToOffset({ offset: 0 })}
            />
          </View>

          <BlurView 
            intensity={80} 
            tint="dark"
            style={[
              styles.inputContainer,
              { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }
            ]}
          >
            <TouchableOpacity
              style={styles.micButton}
              onPressIn={() => setIsRecording(true)}
              onPressOut={() => setIsRecording(false)}
            >
              <Ionicons 
                name={isRecording ? "mic" : "mic-outline"} 
                size={24} 
                color={isRecording ? "#FF3A57" : "#fff"} 
              />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={`Hỏi ${user.name} điều gì đó...`}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              multiline
              onSubmitEditing={handleSend}
            />
            
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!input.trim() || isThinking}
            >
              <Ionicons
                name="send"
                size={24}
                color={input.trim() ? "#4CAF50" : "rgba(255,255,255,0.3)"}
              />
            </TouchableOpacity>
          </BlurView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: { 
    flex: 1, 
    ...StyleSheet.absoluteFillObject 
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "100%",
    overflow: 'hidden',
  },
  headerButton: { 
    padding: 8,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  avatar: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    marginRight: 8 
  },
  userName: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  keyboardView: { 
    flex: 1, 
    justifyContent: "flex-end" 
  },
  chatContainer: {
    maxHeight: 200,
    marginBottom: 8,
  },
  messageList: {
    flexGrow: 0,
  },
  messageListContent: { 
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    maxWidth: '90%',
  },
  userMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageBubble: {
    backgroundColor: "#007AFF",
  },
  botMessageBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  messageText: { 
    color: "#fff", 
    fontSize: 15, 
    lineHeight: 20 
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  thinkingIcon: {
    marginRight: 8,
  },
  thinkingText: {
    color: '#fff',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    maxHeight: 100,
    paddingRight: 8,
    paddingVertical: 8,
  },
  micButton: {
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  hintsContainer: {
    position: 'absolute',
    top: HEADER_HEIGHT + 10,
    left: 16,
    right: 16,
    bottom: 200,
    zIndex: 10,
  },
  hintsBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    flex: 1,
  },
  hintsScroll: {
    flex: 1,
  },
  hintsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  hintsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hintItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIcon: {
    marginRight: 8,
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
});

export default InteractionScreen;