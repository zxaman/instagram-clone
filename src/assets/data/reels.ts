/**
 * Mock reels data for the Reels page.
 */

export interface Reel {
  id: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  isLiked?: boolean;
}

export const reels: Reel[] = [
  {
    id: 'r1',
    userId: 'u1',
    mediaUrl: 'https://picsum.photos/540/960?random=31',
    caption: 'Angular signals + clean UI = productive weekend build.',
    audioTitle: 'Original audio - angular_dev',
    likesCount: 1824,
    commentsCount: 93,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isLiked: false,
  },
  {
    id: 'r2',
    userId: 'u2',
    mediaUrl: 'https://picsum.photos/540/960?random=32',
    caption: 'Teaching component architecture in 45 seconds.',
    audioTitle: 'Mentor Mode - web_teacher',
    likesCount: 3210,
    commentsCount: 148,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isLiked: true,
  },
  {
    id: 'r3',
    userId: 'u3',
    mediaUrl: 'https://picsum.photos/540/960?random=33',
    caption: 'Tiny animations that make interfaces feel alive.',
    audioTitle: 'Frontend Flow - frontend_fan',
    likesCount: 2764,
    commentsCount: 117,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isLiked: false,
  },
  {
    id: 'r4',
    userId: 'u4',
    mediaUrl: 'https://picsum.photos/540/960?random=34',
    caption: 'From placeholder to polished page in one sprint.',
    audioTitle: 'Code Sprint - code_explorer',
    likesCount: 1498,
    commentsCount: 61,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isLiked: false,
  },
];
