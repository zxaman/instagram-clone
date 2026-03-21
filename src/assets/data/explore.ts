/**
 * Mock explore items for the Explore page.
 */

export type ExploreTileSize = 'square' | 'portrait' | 'wide';

export interface ExploreItem {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  mediaType: 'post' | 'reel';
  size: ExploreTileSize;
}

export const exploreItems: ExploreItem[] = [
  {
    id: 'e1',
    userId: 'u1',
    imageUrl: 'https://picsum.photos/900/900?random=101',
    caption: 'Clean Angular architecture in progress.',
    likesCount: 2200,
    commentsCount: 118,
    mediaType: 'post',
    size: 'square',
  },
  {
    id: 'e2',
    userId: 'u2',
    imageUrl: 'https://picsum.photos/900/1200?random=102',
    caption: 'Behind the scenes of a UI workshop.',
    likesCount: 3400,
    commentsCount: 202,
    mediaType: 'reel',
    size: 'portrait',
  },
  {
    id: 'e3',
    userId: 'u3',
    imageUrl: 'https://picsum.photos/1200/900?random=103',
    caption: 'Design systems and spacing rhythm.',
    likesCount: 1890,
    commentsCount: 95,
    mediaType: 'reel',
    size: 'wide',
  },
  {
    id: 'e4',
    userId: 'u4',
    imageUrl: 'https://picsum.photos/900/900?random=104',
    caption: 'Debug day, but make it aesthetic.',
    likesCount: 1320,
    commentsCount: 73,
    mediaType: 'post',
    size: 'square',
  },
  {
    id: 'e5',
    userId: 'u5',
    imageUrl: 'https://picsum.photos/900/1200?random=105',
    caption: 'Profile polish and final QA pass.',
    likesCount: 4100,
    commentsCount: 244,
    mediaType: 'reel',
    size: 'portrait',
  },
  {
    id: 'e6',
    userId: 'u2',
    imageUrl: 'https://picsum.photos/900/900?random=106',
    caption: 'Keyboard navigation done right.',
    likesCount: 1760,
    commentsCount: 101,
    mediaType: 'post',
    size: 'square',
  },
  {
    id: 'e7',
    userId: 'u3',
    imageUrl: 'https://picsum.photos/1200/900?random=107',
    caption: 'Micro interactions that feel premium.',
    likesCount: 2800,
    commentsCount: 167,
    mediaType: 'reel',
    size: 'wide',
  },
  {
    id: 'e8',
    userId: 'u1',
    imageUrl: 'https://picsum.photos/900/900?random=108',
    caption: 'Signal state patterns for large UIs.',
    likesCount: 2470,
    commentsCount: 142,
    mediaType: 'post',
    size: 'square',
  },
  {
    id: 'e9',
    userId: 'u4',
    imageUrl: 'https://picsum.photos/900/1200?random=109',
    caption: 'Night coding session snapshots.',
    likesCount: 1990,
    commentsCount: 114,
    mediaType: 'reel',
    size: 'portrait',
  },
  {
    id: 'e10',
    userId: 'u5',
    imageUrl: 'https://picsum.photos/900/900?random=110',
    caption: 'SCSS architecture for scalable pages.',
    likesCount: 1580,
    commentsCount: 90,
    mediaType: 'post',
    size: 'square',
  },
  {
    id: 'e11',
    userId: 'u2',
    imageUrl: 'https://picsum.photos/900/900?random=111',
    caption: 'Accessibility checks before merge.',
    likesCount: 1120,
    commentsCount: 65,
    mediaType: 'reel',
    size: 'square',
  },
  {
    id: 'e12',
    userId: 'u3',
    imageUrl: 'https://picsum.photos/900/900?random=112',
    caption: 'Grid systems inspired by Instagram Explore.',
    likesCount: 3050,
    commentsCount: 188,
    mediaType: 'reel',
    size: 'square',
  },
];
