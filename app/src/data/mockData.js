// src/data/mockData.js

export const stories = [
  {
    id: '1',
    user: {
      name: 'Minh Anh',
      avatar: 'https://picsum.photos/100/100?random=1',
    },
    title: 'Chuyến đi Đà Lạt 2025',
    thumbnail: 'https://picsum.photos/400/600?random=1',
    description: 'Một chuyến đi ngẫu hứng nhưng đầy ắp kỷ niệm đáng nhớ.',
    // Dữ liệu cốt lõi cho việc tương tác
    metoryData: [
      {
        question: 'Giới thiệu về bản thân', // Câu hỏi mặc định
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        category: 'Cá nhân'
      },
      {
        question: 'kỷ niệm đáng nhớ nhất trong chuyến đi là gì',
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_2MB.mp4',
        category: 'Chuyến đi'
      },
      {
        question: 'bạn cảm thấy thế nào về Đà Lạt',
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_5MB.mp4',
        category: 'Chuyến đi'
      },
      {
        question: 'điều gì khiến bạn ấn tượng nhất về Đà Lạt',
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        category: 'Chuyến đi'
      },
      {
        question: 'bạn đi với ai trong chuyến đi này',
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_2MB.mp4',
        category: 'Chuyến đi'
      },
    ],
  },
  {
    id: '2',
    user: {
      name: 'Thanh Huy',
      avatar: 'https://picsum.photos/100/100?random=2',
    },
    title: 'Gửi tôi của 10 năm sau',
    thumbnail: 'https://picsum.photos/400/600?random=2',
    description: 'Những lời nhắn nhủ cho chính bản thân mình trong tương lai.',
     metoryData: [
      {
        question: 'Giới thiệu về bản thân',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        category: 'Cá nhân'
      },
      {
        question: 'mục tiêu lớn nhất hiện tại của bạn là gì',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
        category: 'Tương lai'
      },
      {
        question: 'bạn mong muốn gì từ bản thân 10 năm nữa',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        category: 'Tương lai'
      },
      {
        question: 'điều gì khiến bạn hạnh phúc nhất hiện tại',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
        category: 'Cá nhân'
      },
    ],
  },
   // Thêm các stories khác ở đây...
];