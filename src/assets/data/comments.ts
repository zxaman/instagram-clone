/**
 * Mock comments – import from assets/data for post comments.
 */

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  timestamp: string;
}

export const comments: Comment[] = [
  { id: 'c1', postId: 'p1', userId: 'u2', text: 'Nice setup!', timestamp: new Date(Date.now() - 3000000).toISOString() },
  { id: 'c2', postId: 'p1', userId: 'u3', text: 'Which Angular version?', timestamp: new Date(Date.now() - 2800000).toISOString() },
  { id: 'c3', postId: 'p1', userId: 'u1', text: 'Latest stable.', timestamp: new Date(Date.now() - 2600000).toISOString() },
  { id: 'c4', postId: 'p2', userId: 'u4', text: 'Love this approach.', timestamp: new Date(Date.now() - 6000000).toISOString() },
  { id: 'c5', postId: 'p2', userId: 'u1', text: 'Thanks!', timestamp: new Date(Date.now() - 5800000).toISOString() },
  { id: 'c6', postId: 'p3', userId: 'u2', text: 'Agreed, dark mode is the way.', timestamp: new Date(Date.now() - 12000000).toISOString() },
];
