/**
 * Mock notes for the messages page note bubbles.
 * Notes are short status messages that appear above user avatars.
 */

export interface Note {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export const notes: Note[] = [
  {
    id: 'note1',
    userId: 'u5',
    text: 'Ask friends anything...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'note2',
    userId: 'u1',
    text: 'Learning Angular signals 💪',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'note3',
    userId: 'u2',
    text: 'New tutorial coming soon!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'note4',
    userId: 'u3',
    text: 'Frontend is 🔥',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];
