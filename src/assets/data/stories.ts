/**
 * Mock stories – import from assets/data for story section.
 */

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  timestamp: string;
  seen?: boolean;
}

export const stories: Story[] = [
  { id: 's1', userId: 'u5', mediaUrl: '', timestamp: new Date().toISOString(), seen: false },
  { id: 's2', userId: 'u1', mediaUrl: 'https://picsum.photos/400/600?random=1', timestamp: new Date(Date.now() - 3600000).toISOString(), seen: false },
  { id: 's3', userId: 'u2', mediaUrl: 'https://picsum.photos/400/600?random=2', timestamp: new Date(Date.now() - 7200000).toISOString(), seen: true },
  { id: 's4', userId: 'u3', mediaUrl: 'https://picsum.photos/400/600?random=3', timestamp: new Date(Date.now() - 10800000).toISOString(), seen: false },
  { id: 's5', userId: 'u4', mediaUrl: 'https://picsum.photos/400/600?random=4', timestamp: new Date(Date.now() - 14400000).toISOString(), seen: true },
];
