export interface DynamicPost {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
}

export const dynamicData: DynamicPost[] = [
  {
    id: '1',
    content: '今天去拍了新的写真，好累呀~不过看到照片觉得一切都值得！感谢摄影师大大！',
    imageUrl: '/images/Camera_1040g3k031em343004s0g5nfj6s908hecvvuohbg.jpg',
    createdAt: '2025-11-17 18:30',
    likes: 12580,
  },
  {
    id: '2',
    content: '感冒了好难受，大家要注意保暖哦~',
    createdAt: '2025-11-16 22:15',
    likes: 23450,
  },
  {
    id: '3',
    content: '今天吃了好吃的火锅！好满足~',
    imageUrl: '/images/Camera_1040g3k031em343004s105nfj6s908heco4dmheo.jpg',
    createdAt: '2025-11-15 19:45',
    likes: 18920,
  },
  {
    id: '4',
    content: '准备去长沙方特啦！期待和大家见面~',
    createdAt: '2025-11-14 10:00',
    likes: 34560,
  },
  {
    id: '5',
    content: '新买的汉服到啦！试穿一下，感觉还不错~',
    imageUrl: '/images/Camera_1040g3k031em343004s1g5nfj6s908heci78prrg.jpg',
    createdAt: '2025-11-13 15:20',
    likes: 45670,
  },
  {
    id: '6',
    content: '深夜加班中...明天还要早起，好困呀',
    createdAt: '2025-11-12 00:30',
    likes: 15680,
  },
  {
    id: '7',
    content: '今天的妆造好喜欢！感谢化妆师姐姐~',
    imageUrl: '/images/Camera_1040g3k031em343004s205nfj6s908hec5u28e10.jpg',
    createdAt: '2025-11-11 16:00',
    likes: 28900,
  },
  {
    id: '8',
    content: '双十一大家都买了什么呀？我买了好多汉服材料~',
    createdAt: '2025-11-11 00:00',
    likes: 31200,
  },
  {
    id: '9',
    content: '感谢大家的支持！粉丝突破300万啦！爱你们~',
    createdAt: '2025-11-10 20:00',
    likes: 89000,
  },
  {
    id: '10',
    content: '今天去了漫展，见到了好多可爱的小伙伴！',
    imageUrl: '/images/Camera_1040g3k031em343004s2g5nfj6s908hec9j0u03o.jpg',
    createdAt: '2025-11-09 18:30',
    likes: 35670,
  },
];
