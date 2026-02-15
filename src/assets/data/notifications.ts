/**
 * Mock notifications for the current user (userId 'u5').
 */

export type NotificationType = 'like' | 'comment' | 'follow';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  actorId: string;
  postId?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    userId: 'u5',
    actorId: 'u1',
    postId: 'p1',
    text: 'liked your post.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: 'n2',
    type: 'comment',
    userId: 'u5',
    actorId: 'u2',
    postId: 'p1',
    text: 'commented on your post.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    type: 'follow',
    userId: 'u5',
    actorId: 'u3',
    text: 'started following you.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
  },
  {
    id: 'n4',
    type: 'like',
    userId: 'u5',
    actorId: 'u4',
    postId: 'p2',
    text: 'liked your post.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
];
