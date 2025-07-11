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
  const [customQuestion, setCustomQuestion] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);

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
        'Phương tiện di chuyển yêu thích khi du lịch?',
        'Khoảnh khắc bất ngờ nhất trong chuyến đi?',
        'Nơi nào bạn muốn quay lại nhiều lần?'
      ],
      'Ẩm thực': [
        'Món ăn yêu thích của bạn là gì?',
        'Công thức nấu ăn đặc biệt của gia đình bạn?',
        'Nhà hàng để lại ấn tượng sâu sắc nhất?',
        'Món ăn nào khiến bạn nhớ về tuổi thơ?',
        'Bí quyết nấu ăn ngon mà bạn muốn chia sẻ?',
        'Trải nghiệm ẩm thực khó quên nhất?',
        'Món ăn bạn có thể ăn mỗi ngày?',
        'Nguyên liệu không thể thiếu trong bếp?'
      ],
      'Thể thao': [
        'Môn thể thao bạn yêu thích nhất?',
        'Kỷ niệm thể thao đáng nhớ nhất của bạn?',
        'Vận động viên thần tượng của bạn?',
        'Lợi ích tuyệt vời nhất của việc chơi thể thao?',
        'Mục tiêu thể thao bạn muốn đạt được?',
        'Bài tập yêu thích để giữ dáng?',
        'Khoảnh khắc tự hào nhất khi tập luyện?',
        'Lời khuyên cho người mới bắt đầu?'
      ],
      'Công nghệ': [
        'Công nghệ nào thay đổi cuộc sống bạn nhiều nhất?',
        'App hoặc thiết bị không thể thiếu của bạn?',
        'Xu hướng công nghệ bạn quan tâm nhất?',
        'Cách công nghệ giúp bạn kết nối với mọi người?',
        'Dự đoán của bạn về công nghệ trong tương lai?',
        'Thiết bị công nghệ đầu tiên bạn sở hữu?',
        'Tính năng công nghệ bạn mong chờ nhất?',
        'Cách bạn sử dụng AI trong cuộc sống?'
      ],
      'Âm nhạc': [
        'Bài hát yêu thích mọi thời đại của bạn?',
        'Ca sĩ hoặc ban nhạc thần tượng?',
        'Kỷ niệm đặc biệt với âm nhạc?',
        'Nhạc cụ bạn muốn học chơi?',
        'Thể loại nhạc làm bạn thư giãn nhất?',
        'Concert đáng nhớ nhất bạn từng tham dự?',
        'Bài hát nào luôn làm bạn vui lên?',
        'Cách âm nhạc ảnh hưởng đến tâm trạng?'
      ],
      'Phim ảnh': [
        'Bộ phim yêu thích của bạn?',
        'Thể loại phim bạn thích xem nhất?',
        'Diễn viên hoặc đạo diễn bạn ngưỡng mộ?',
        'Phim nào khiến bạn khóc nhiều nhất?',
        'Bộ phim bạn có thể xem đi xem lại?',
        'Trải nghiệm rạp chiếu phim đáng nhớ?',
        'Phim nào thay đổi suy nghĩ của bạn?',
        'Xu hướng điện ảnh bạn quan tâm?'
      ],
      'Sách': [
        'Cuốn sách yêu thích nhất của bạn?',
        'Tác giả nào bạn ngưỡng mộ nhất?',
        'Thể loại sách bạn thích đọc?',
        'Cuốn sách thay đổi cuộc đời bạn?',
        'Thói quen đọc sách của bạn?',
        'Nơi yêu thích để đọc sách?',
        'Câu chuyện nào ấn tượng nhất?',
        'Lời khuyên cho người mới bắt đầu đọc?'
      ],
      'Thời trang': [
        'Phong cách thời trang yêu thích?',
        'Món đồ không thể thiếu trong tủ?',
        'Thương hiệu thời trang bạn yêu thích?',
        'Outfit tự tin nhất của bạn?',
        'Xu hướng thời trang bạn theo đuổi?',
        'Cách mix đồ độc đáo của bạn?',
        'Phụ kiện không thể thiếu?',
        'Lời khuyên về phong cách cá nhân?'
      ],
      'Sức khỏe': [
        'Thói quen sức khỏe tốt nhất của bạn?',
        'Bài tập yêu thích để giữ dáng?',
        'Cách bạn giữ tinh thần tích cực?',
        'Thực phẩm healthy bạn thích nhất?',
        'Lời khuyên sức khỏe bạn muốn chia sẻ?',
        'Cách cân bằng giữa work và life?',
        'Hoạt động nào giúp bạn thư giãn?',
        'Mục tiêu sức khỏe trong năm nay?'
      ],
      'Giáo dục': [
        'Môn học yêu thích nhất ở trường?',
        'Giáo viên nào ảnh hưởng lớn đến bạn?',
        'Kỹ năng bạn muốn học thêm?',
        'Phương pháp học tập hiệu quả nhất?',
        'Kiến thức nào thay đổi suy nghĩ bạn?',
        'Khóa học online bạn muốn tham gia?',
        'Cách bạn áp dụng kiến thức vào thực tế?',
        'Lời khuyên cho người đang học tập?'
      ],
      'Kinh doanh': [
        'Ý tưởng kinh doanh bạn quan tâm?',
        'Doanh nhân nào bạn ngưỡng mộ?',
        'Kỹ năng quan trọng nhất trong kinh doanh?',
        'Thách thức lớn nhất khi khởi nghiệp?',
        'Cách bạn tìm cơ hội kinh doanh?',
        'Sản phẩm/dịch vụ bạn muốn tạo ra?',
        'Bài học kinh doanh quý giá nhất?',
        'Xu hướng kinh doanh trong tương lai?'
      ],
      'Gia đình': [
        'Kỷ niệm gia đình đáng nhớ nhất?',
        'Truyền thống gia đình bạn yêu thích?',
        'Người thân nào ảnh hưởng lớn đến bạn?',
        'Hoạt động gia đình yêu thích?',
        'Bài học quý giá từ gia đình?',
        'Cách bạn thể hiện tình yêu thương?',
        'Món ăn đặc biệt của gia đình?',
        'Kế hoạch tương lai cho gia đình?'
      ]
    };

    return (questionSets[topicTitle] || [
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

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      const newQuestion = {
        id: questions.length + 1,
        text: customQuestion.trim(),
        isSelected: false,
        isCustom: true
      };
      setQuestions([...questions, newQuestion]);
      setCustomQuestion('');
      setShowAddQuestion(false);
      Alert.alert('Thành công', 'Đã thêm câu hỏi tự tạo!');
    }
  };

  const deleteQuestion = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (question.isCustom) {
      Alert.alert(
        'Xóa câu hỏi',
        'Bạn có chắc chắn muốn xóa câu hỏi này?',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: () => {
              setQuestions(questions.filter(q => q.id !== questionId));
              setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
            }
          }
        ]
      );
    }
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

      {/* Smart Tips */}
      <View style={styles.tipsContainer}>
        {selectedQuestions.length === 0 && (
          <View style={styles.tip}>
            <Ionicons name="bulb-outline" size={16} color="#ffa502" />
            <Text style={styles.tipText}>Chọn 3-5 câu hỏi để tạo story thú vị nhất!</Text>
          </View>
        )}
        {selectedQuestions.length >= 3 && selectedQuestions.length < 5 && (
          <View style={styles.tip}>
            <Ionicons name="checkmark-circle" size={16} color="#2ed573" />
            <Text style={styles.tipText}>Tuyệt vời! Bạn có thể thêm {5 - selectedQuestions.length} câu hỏi nữa.</Text>
          </View>
        )}
        {selectedQuestions.length === 5 && (
          <View style={styles.tip}>
            <Ionicons name="star" size={16} color="#007AFF" />
            <Text style={styles.tipText}>Hoàn hảo! Bạn đã chọn đủ 5 câu hỏi cho story.</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Custom Question */}
        {showAddQuestion ? (
          <View style={styles.addQuestionCard}>
            <Text style={styles.addQuestionTitle}>Tạo câu hỏi của riêng bạn</Text>
            <TextInput
              style={styles.customQuestionInput}
              value={customQuestion}
              onChangeText={setCustomQuestion}
              placeholder="Nhập câu hỏi của bạn..."
              placeholderTextColor="#666"
              multiline
              autoFocus
            />
            <View style={styles.addQuestionActions}>
              <TouchableOpacity
                style={styles.cancelAddButton}
                onPress={() => {
                  setShowAddQuestion(false);
                  setCustomQuestion('');
                }}
              >
                <Text style={styles.cancelAddButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.addQuestionButton,
                  !customQuestion.trim() && styles.disabledAddButton
                ]}
                onPress={addCustomQuestion}
                disabled={!customQuestion.trim()}
              >
                <Text style={styles.addQuestionButtonText}>Thêm câu hỏi</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.showAddQuestionButton}
            onPress={() => setShowAddQuestion(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.showAddQuestionText}>Tạo câu hỏi của riêng bạn</Text>
          </TouchableOpacity>
        )}

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
                  <Text style={styles.questionNumber}>
                    Câu {question.id} {question.isCustom && '(Tự tạo)'}
                  </Text>
                  <View style={styles.questionActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => startEditQuestion(question)}
                    >
                      <Ionicons name="pencil" size={16} color="#666" />
                    </TouchableOpacity>
                    {question.isCustom && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteQuestion(question.id)}
                      >
                        <Ionicons name="trash" size={16} color="#ff4757" />
                      </TouchableOpacity>
                    )}
                  </View>
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
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  questionActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  // Add Question Styles
  showAddQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  showAddQuestionText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  addQuestionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  addQuestionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  customQuestionInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    minHeight: 60,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  addQuestionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  cancelAddButtonText: {
    color: '#666',
    fontSize: 14,
  },
  addQuestionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledAddButton: {
    backgroundColor: '#333',
  },
  addQuestionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Tips Styles
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 2, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#ffa502',
  },
  tipText: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default QuestionSelectionScreen;
