export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  tags: string[];
  createdAt: string;
  duration: string;
  viewCount: number;
  platform: 'douyin' | 'bilibili';
}

export const videoCategories = [
  { id: 'all', name: '全部' },
  { id: 'cosplay', name: 'Cosplay' },
  { id: 'daily', name: '日常' },
  { id: 'event', name: '活动' },
];

export const videoData: VideoItem[] = [
  {
    id: '1',
    title: '谁的爱不疯',
    description: '古风舞蹈视频，唯美动人',
    url: 'https://www.bilibili.com/video/BV1MvswzvE7u/',
    thumbnail: '/images/Camera_1040g3k031bf35nmb0e005nfj6s908hecs491hig.jpg',
    category: 'cosplay',
    tags: ['舞蹈', '古风', '唯美'],
    createdAt: '2024-08-18',
    duration: '00:15',
    viewCount: 63000,
    platform: 'bilibili',
  },
  {
    id: '2',
    title: '果然，戴上墨镜就是最靓的崽',
    description: '爆火出圈视频，获得55.5万点赞',
    url: 'https://www.douyin.com/',
    thumbnail: '/images/Camera_1040g3k031bf35nmb0e105nfj6s908hech9elll8.jpg',
    category: 'cosplay',
    tags: ['墨镜', '出圈', '热门'],
    createdAt: '2023-04-09',
    duration: '00:18',
    viewCount: 555000,
    platform: 'douyin',
  },
  {
    id: '3',
    title: '看什么看，没见过贵妃吃糯米饭',
    description: '可爱日常视频，呆萌有趣',
    url: 'https://www.douyin.com/',
    thumbnail: '/images/Camera_1040g3k031bf35nmb0e1g5nfj6s908hechs1i87o.jpg',
    category: 'daily',
    tags: ['贵妃', '美食', '可爱'],
    createdAt: '2023-05-09',
    duration: '00:12',
    viewCount: 22000,
    platform: 'douyin',
  },
  {
    id: '4',
    title: '好山好水好~',
    description: '风景优美的旅拍视频',
    url: 'https://www.bilibili.com/',
    thumbnail: '/images/Camera_1040g3k031bf35nmb0e2g5nfj6s908heckmeldq0.jpg',
    category: 'event',
    tags: ['风景', '旅拍', '山水'],
    createdAt: '2024-07-26',
    duration: '00:10',
    viewCount: 13000,
    platform: 'bilibili',
  },
  {
    id: '5',
    title: '穿明制去吃下午茶',
    description: '汉服日常vlog',
    url: 'https://www.bilibili.com/video/BV1eVRgBdEhS/',
    thumbnail: '/images/Camera_1040g3k031bf35nmb0e305nfj6s908hec4m5d0r8.jpg',
    category: 'daily',
    tags: ['明制', '下午茶', '汉服'],
    createdAt: '2025-10-10',
    duration: '00:15',
    viewCount: 36000,
    platform: 'bilibili',
  },
  {
    id: '6',
    title: '短短十几秒心动无数次',
    description: '古风写真视频',
    url: 'https://www.bilibili.com/video/BV1eLntzBEWB/',
    thumbnail: '/images/Camera_1040g3k031em343004s005nfj6s908hec77lgr8o.jpg',
    category: 'cosplay',
    tags: ['心动', '古风', '写真'],
    createdAt: '2025-10-05',
    duration: '00:12',
    viewCount: 58000,
    platform: 'bilibili',
  },
];
