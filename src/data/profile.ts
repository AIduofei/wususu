export interface TimelineItem {
  year: string;
  event: string;
  description: string;
}

export interface Profile {
  name: string;
  realName: string;
  nicknames: string[];
  avatar: string;
  bio: string;
  description: string;
  stats: {
    fans: number;
    works: number;
    likes: number;
  };
  tags: string[];
  personality: string[];
  timeline: TimelineItem[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export const profileData: Profile = {
  name: '乌苏苏',
  realName: '翁苏怡',
  nicknames: ['乌猪猪', '乌鲁鲁', '乌呆呆', '乌苏啤酒'],
  avatar: '/images/Camera_1040g0k031riivdjei6005p9u30h38t17ojhqo20.jpg',
  bio: '平安健康，开心快乐，永远钟爱中式古典美学',
  description: '一个能让你充满保护欲的女生，一个天生0.75倍速说话的女生，但你却不忍心催她说快一点，而是非常有耐心的听她说完。她那温婉的气质配上慢悠悠的说话语气，不知道俘获了多少少年的心。作为痛风三人组之一，她以超高的颜值和精美的国风造型，成为了古风圈的新晋真神。',
  stats: {
    fans: 3356000,
    works: 631,
    likes: 84544000,
  },
  tags: ['国风', '汉服', 'cosplay', '王者荣耀', '二次元'],
  personality: [
    '说话慢吞吞的，像0.75倍速播放',
    '温柔但有脾气，性格特别好',
    '呆萌可爱，线下社恐',
    '勤俭持家，懂厨艺',
    '钟爱中式古典美学',
  ],
  timeline: [
    {
      year: '2022年6月',
      event: '入驻抖音',
      description: '发布首条作品，开始在抖音平台分享内容',
    },
    {
      year: '2023年2月',
      event: '粉丝突破10万',
      description: '凭借精美的国风造型和独特气质，粉丝量快速增长',
    },
    {
      year: '2023年4月',
      event: '洛阳一舞成名',
      description: '发布《果然，戴上墨镜就是最靓的崽》，获得55.5万点赞',
    },
    {
      year: '2024年9月',
      event: '粉丝突破100万',
      description: '成为百万粉丝博主，国风领域影响力持续扩大',
    },
    {
      year: '2025年',
      event: '痛风三人组成立',
      description: '与杀生鱼丸、我不叫龙虾组成国风三人组，火遍全网',
    },
  ],
  socialLinks: [
    { platform: '抖音', url: 'https://www.douyin.com/user/86179600435' },
    { platform: 'B站', url: 'https://space.bilibili.com/247999404' },
  ],
};
