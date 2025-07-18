// =================================================================
// == 1. USERS - DANH SÁCH NGƯỜI DÙNG
// =================================================================
export const users = {
  'user_01': {
    id: 'user_01',
    name: 'Minh Anh',
    username: '@minhanh_travel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
    followers: '1.2K',
    following: '453',
    storiesCount: '3',
    bio: 'Travel enthusiast & storyteller ✈️\nExploring the world, one story at a time.',
    verified: true,
  },
  'user_02': {
    id: 'user_02',
    name: 'Chef Huy',
    username: '@chef_huy_kitchen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
    followers: '89.5K',
    following: '120',
    storiesCount: '2',
    bio: 'Food lover sharing recipes from my kitchen to yours 🍜',
    verified: true,
  },
  'user_03': {
    id: 'user_03',
    name: 'Thu Hiền',
    username: '@yogawithhien',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
    followers: '210K',
    following: '88',
    storiesCount: '1',
    bio: 'Yoga instructor & wellness coach. Find your balance with me.',
    verified: false,
  },
  'user_04': {
    id: 'user_04',
    name: 'Gia Bảo',
    username: '@baotech',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400',
    followers: '55.2K',
    following: '301',
    storiesCount: '1',
    bio: 'Unboxing the future of tech 💻📱',
    verified: true,
  }
};


// =================================================================
// == 2. STORIES - DANH SÁCH CÁC CÂU CHUYỆN
// =================================================================
export const stories = [
  {
    id: 'story_01',
    userId: 'user_01', // Liên kết với user Minh Anh
    title: 'Chuyến đi Hà Giang 2025',
    thumbnail: 'https://images.unsplash.com/photo-1588622146903-04b3ea5d8a07?q=80&w=800',
    description: 'Một chuyến đi ngẫu hứng nhưng đầy ắp kỷ niệm đáng nhớ trên cung đường Hạnh Phúc.',
    topic: { title: 'Du lịch', icon: 'airplane', color: '#ff6b6b' },
    views: '12.5K',
    likes: '1.2K',
    duration: '5:45',
    metoryData: [
      {
        question: 'Giới thiệu về chuyến đi này?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        category: 'Tổng quan'
      },
      {
        question: 'Kỷ niệm đáng nhớ nhất là gì?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        category: 'Kỷ niệm'
      },
      {
        question: 'Bạn cảm thấy thế nào về Hà Giang?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        category: 'Cảm xúc'
      },
      {
        question: 'Món ăn nào bạn thích nhất?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        category: 'Ẩm thực'
      },
    ],
  },
  {
    id: 'story_02',
    userId: 'user_02', // Liên kết với user Chef Huy
    title: 'Công thức Phở Bò Gia Truyền',
    thumbnail: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=800',
    description: 'Bí quyết nấu một bát phở bò đậm đà, chuẩn vị Hà Nội ngay tại nhà.',
    topic: { title: 'Ẩm thực', icon: 'restaurant', color: '#4ecdc4' },
    views: '89.1K',
    likes: '11.3K',
    duration: '8:12',
    metoryData: [
      {
        question: 'Giới thiệu về món phở này?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        category: 'Giới thiệu'
      },
      {
        question: 'Bí quyết để nước dùng trong và ngọt là gì?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        category: 'Bí quyết'
      },
    ],
  },
  {
    id: 'story_03',
    userId: 'user_03', // Liên kết với user Thu Hiền
    title: 'Yoga Chào Buổi Sáng',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800',
    description: '5 phút mỗi sáng để khởi đầu một ngày mới tràn đầy năng lượng và tích cực.',
    topic: { title: 'Sức khỏe', icon: 'fitness', color: '#45b7d1' },
    views: '150.2K',
    likes: '25.6K',
    duration: '5:00',
    metoryData: [
       {
        question: 'Bài tập này dành cho ai?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        category: 'Giới thiệu'
      },
      {
        question: 'Lợi ích của việc tập yoga buổi sáng là gì?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        category: 'Lợi ích'
      },
    ],
  },
  {
    id: 'story_04',
    userId: 'user_04', // Liên kết với user Gia Bảo
    title: 'Review chi tiết Macbook Pro M4',
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
    description: 'Liệu đây có phải là chiếc laptop đáng mua nhất năm 2025?',
    topic: { title: 'Công nghệ', icon: 'laptop-outline', color: '#96ceb4' },
    views: '250K',
    likes: '35.1K',
    duration: '12:30',
    metoryData: [
       {
        question: 'Thiết kế có gì mới?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        category: 'Thiết kế'
      },
      {
        question: 'Hiệu năng thực tế như thế nào?',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        category: 'Hiệu năng'
      },
    ],
  },
];


// =================================================================
// == 3. ACTIVITIES - DỮ LIỆU CHO MÀN HÌNH HOẠT ĐỘNG
// =================================================================
export const activities = [
    {
      id: 'act_01',
      type: 'like',
      user: users['user_02'],
      story: stories[0],
      timestamp: '5 phút trước',
      isRead: false,
    },
    {
      id: 'act_02',
      type: 'comment',
      user: users['user_03'],
      story: stories[1],
      comment: 'Công thức tuyệt vời! Cảm ơn bạn đã chia sẻ.',
      timestamp: '1 giờ trước',
      isRead: false,
    },
    {
      id: 'act_03',
      type: 'follow',
      user: users['user_04'],
      timestamp: '2 giờ trước',
      isRead: true,
    },
     {
      id: 'act_04',
      type: 'like',
      user: users['user_01'],
      story: stories[2],
      timestamp: '1 ngày trước',
      isRead: true,
    },
];

// =================================================================
// == 4. SAVED STORIES & COLLECTIONS
// =================================================================
export const savedStories = stories.slice(0, 3); // Lấy 3 story đầu tiên làm story đã lưu

export const collections = [
    {
      id: 'col_01',
      name: 'Cảm hứng du lịch',
      count: 12,
      thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400',
      color: '#ff6b6b',
    },
    {
      id: 'col_02',
      name: 'Công thức nấu ăn',
      count: 8,
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17021?q=80&w=400',
      color: '#4ecdc4',
    },
];


// =================================================================
// == 5. SEARCH DATA
// =================================================================
export const trendingTopics = [
    { id: 1, title: 'Du lịch', count: '2.5K stories', color: '#ff6b6b' },
    { id: 2, title: 'Ẩm thực', count: '1.8K stories', color: '#4ecdc4' },
    { id: 3, title: 'Sức khỏe', count: '1.2K stories', color: '#45b7d1' },
    { id: 4, title: 'Công nghệ', count: '950 stories', color: '#96ceb4' },
];

// Dữ liệu cho ProfileScreen, lấy từ user đầu tiên
export const myProfile = users['user_01'];
export const myStories = stories.filter(s => s.userId === myProfile.id);