/**
 * Mock messages for conversations.
 */

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  seen: boolean;
}

export const messages: Message[] = [
  // conv1 – u5 <-> u1 (angular_dev)
  {
    id: 'm1',
    conversationId: 'conv1',
    senderId: 'u1',
    text: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    seen: true,
  },
  {
    id: 'm2',
    conversationId: 'conv1',
    senderId: 'u5',
    text: "I'm good! Working on the Instagram clone.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    seen: true,
  },
  {
    id: 'm3',
    conversationId: 'conv1',
    senderId: 'u1',
    text: 'Nice! Angular 19 is awesome for that.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    seen: true,
  },
  {
    id: 'm4',
    conversationId: 'conv1',
    senderId: 'u1',
    text: 'Hey! Have you tried the new Angular signals?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    seen: false,
  },

  // conv2 – u5 <-> u2 (web_teacher)
  {
    id: 'm5',
    conversationId: 'conv2',
    senderId: 'u2',
    text: 'Your last video was really helpful.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    seen: true,
  },
  {
    id: 'm6',
    conversationId: 'conv2',
    senderId: 'u5',
    text: 'Thanks! Working on the next one now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    seen: true,
  },
  {
    id: 'm7',
    conversationId: 'conv2',
    senderId: 'u5',
    text: 'Great tutorial! When is the next one?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    seen: true,
  },

  // conv3 – u5 <-> u3 (frontend_fan)
  {
    id: 'm8',
    conversationId: 'conv3',
    senderId: 'u3',
    text: 'Hey! Just followed you.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    seen: true,
  },
  {
    id: 'm9',
    conversationId: 'conv3',
    senderId: 'u5',
    text: 'Welcome! Great to connect.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
    seen: true,
  },
  {
    id: 'm10',
    conversationId: 'conv3',
    senderId: 'u3',
    text: 'Thanks for the follow! 🎉',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    seen: false,
  },

  // conv4 – u5 <-> u4 (code_explorer)
  {
    id: 'm11',
    conversationId: 'conv4',
    senderId: 'u4',
    text: 'Are you going to the Angular meetup?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    seen: true,
  },
  {
    id: 'm12',
    conversationId: 'conv4',
    senderId: 'u5',
    text: 'Yes! Looking forward to it.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    seen: true,
  },
  {
    id: 'm13',
    conversationId: 'conv4',
    senderId: 'u4',
    text: 'See you at the meetup!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    seen: true,
  },
];
