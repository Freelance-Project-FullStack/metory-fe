import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuestionSelectionScreen = ({ navigation, route }) => {
  const { topic } = route.params;
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate AI generated questions based on topic
  useEffect(() => {
    generateQuestions();
  }, [topic]);

  const generateQuestions = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const topicQuestions = getQuestionsForTopic(topic.title);
      setQuestions(topicQuestions);
      setLoading(false);
    }, 2000);
  };

  const getQuestionsForTopic = (topicTitle) => {
    const questionSets = {
      'Du lịch': [
        'Địa điểm du lịch nào khiến bạn ấn tượng nhất?',
        'Kỷ niệm đáng nhớ nhất trong chuyến đi gần đây?',
        'Món ăn địa phương nào bạn muốn thử lần nữa?',
        'Lời khuyên du lịch tốt nhất bạn từng nhận được?',
        'Điều gì khiến bạn cảm thấy hạnh phúc khi du lịch?',
      ],
      'Ẩm thực': [
        'Món ăn yêu thích của bạn là gì?',
        'Công thức nấu ăn đặc biệt của gia đình bạn?',
        'Nhà hàng để lại ấn tượng sâu sắc nhất?',
        'Món ăn nào khiến bạn nhớ về tuổi thơ?',
        'Bí quyết nấu ăn ngon mà bạn muốn chia sẻ?',
      ],
      'Thể thao': [
        'Môn thể thao bạn yêu thích nhất?',
        'Kỷ niệm thể thao đáng nhớ nhất của bạn?',
        'Vận động viên thần tượng của bạn?',
        'Lợi ích tuyệt vời nhất của việc chơi thể thao?',
        'Mục tiêu thể thao bạn muốn đạt được?',
      ],
      'Công nghệ': [
        'Công nghệ nào thay đổi cuộc sống bạn nhiều nhất?',
        'App hoặc thiết bị không thể thiếu của bạn?',
        'Xu hướng công nghệ bạn quan tâm nhất?',
        'Cách công nghệ giúp bạn kết nối với mọi người?',
        'Dự đoán của bạn về công nghệ trong tương lai?',
      ],
    };

    return (topicQuestions[topicTitle] || [
      'Điều gì khiến bạn đam mê về chủ đề này?',
      'Kinh nghiệm thú vị nhất của bạn?',
      'Lời khuyên bạn muốn chia sẻ?',
      'Điều gì bạn học được từ sở thích này?',
      'Mục tiêu tiếp theo của bạn?',
    ]).map((q, index) => ({
      id: index + 1,
      text: q,
      isSelected: false,
    }));
  };

  const toggleQuestionSelection = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      if (selectedQuestions.length < 5) {
        setSelectedQuestions([...selectedQuestions, questionId]);
      } else {
        Alert.alert('Thông báo', 'Bạn chỉ có thể chọn tối đa 5 câu hỏi');
      }
    }
  };

  const startEditQuestion = (question) => {
    setEditingQuestion(question.id);
    setEditText(question.text);
  };

  const saveEditQuestion = () => {
    if (editText.trim()) {
      setQuestions(questions.map(q => 
        q.id === editingQuestion ? { ...q, text: editText.trim() } : q
      ));
      setEditingQuestion(null);
      setEditText('');
    }
  };

  const cancelEditQuestion = () => {
    setEditingQuestion(null);
    setEditText('');
  };

  const handleContinue = () => {
    if (selectedQuestions.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất 1 câu hỏi');
      return;
    }

    const selectedQuestionData = questions.filter(q => 
      selectedQuestions.includes(q.id)
    );

    navigation.navigate('RecordVideo', { 
      topic: topic,
      questions: selectedQuestionData 
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>AI đang tạo câu hỏi cho bạn...</Text>
          <Text style={styles.loadingSubtext}>Chủ đề: {topic.title}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn câu hỏi</Text>
        <TouchableOpacity
          style={styles.regenerateButton}
          onPress={generateQuestions}
        >
          <Ionicons name="refresh" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.topicInfo}>
        <View style={[styles.topicIcon, { backgroundColor: topic.color }]}>
          <Ionicons name={topic.icon} size={20} color="#fff" />
        </View>
        <Text style={styles.topicTitle}>{topic.title}</Text>
        <Text style={styles.selectionCount}>
          {selectedQuestions.length}/5 câu hỏi đã chọn
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {questions.map((question) => (
          <View key={question.id} style={styles.questionCard}>
            {editingQuestion === question.id ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={editText}
                  onChangeText={setEditText}
                  multiline
                  autoFocus
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={cancelEditQuestion}
                  >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveEditQuestion}
                  >
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.questionHeader}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      selectedQuestions.includes(question.id) && styles.checkedBox,
                    ]}
                    onPress={() => toggleQuestionSelection(question.id)}
                  >
                    {selectedQuestions.includes(question.id) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.questionNumber}>Câu {question.id}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => startEditQuestion(question)}
                  >
                    <Ionicons name="pencil" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.questionText}>{question.text}</Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedQuestions.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedQuestions.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Bắt đầu quay ({selectedQuestions.length})
          </Text>
          <Ionicons name="videocam" size={20} color="#fff" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#666',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
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
  regenerateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  selectionCount: {
    color: '#666',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  questionNumber: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    minHeight: 60,
    marginBottom: 12,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
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

export default QuestionSelectionScreen;
