/**
 * Mock posts – import from assets/data for feed.
 */

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const posts: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    imageUrl: 'https://picsum.photos/600/600?random=10',
    caption: 'Building something cool with Angular today. #angular #webdev',
    likesCount: 124,
    commentsCount: 8,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'p2',
    userId: 'u2',
    imageUrl: 'https://picsum.photos/600/600?random=11',
    caption: 'Teaching clean code: SCSS for style, TS for logic, HTML for structure.',
    likesCount: 89,
    commentsCount: 12,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'p3',
    userId: 'u3',
    imageUrl: 'https://picsum.photos/600/600?random=12',
    caption: 'Dark mode everywhere. Best for the eyes.',
    likesCount: 256,
    commentsCount: 24,
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    isLiked: false,
    isSaved: true,
  },
];
