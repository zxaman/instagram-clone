/**
 * Mock conversations for the current user (userId 'u5').
 */

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageSenderId: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    participantIds: ['u5', 'u1'],
    lastMessage: 'Hey! Have you tried the new Angular signals?',
    lastMessageSenderId: 'u1',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'conv2',
    participantIds: ['u5', 'u2'],
    lastMessage: 'Great tutorial! When is the next one?',
    lastMessageSenderId: 'u5',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'conv3',
    participantIds: ['u5', 'u3'],
    lastMessage: 'Thanks for the follow! 🎉',
    lastMessageSenderId: 'u3',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'conv4',
    participantIds: ['u5', 'u4'],
    lastMessage: 'See you at the meetup!',
    lastMessageSenderId: 'u4',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unreadCount: 0,
  },
];
