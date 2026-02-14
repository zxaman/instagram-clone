/**
 * Mock users – import from assets/data for feed, stories, suggestions.
 */

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified?: boolean;
}

export const users: User[] = [
  {
    id: 'u1',
    username: 'angular_dev',
    displayName: 'Angular Dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=angular',
    isVerified: false,
  },
  {
    id: 'u2',
    username: 'web_teacher',
    displayName: 'Web Teacher',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
    isVerified: true,
  },
  {
    id: 'u3',
    username: 'frontend_fan',
    displayName: 'Frontend Fan',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
    isVerified: false,
  },
  {
    id: 'u4',
    username: 'code_explorer',
    displayName: 'Code Explorer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer',
    isVerified: false,
  },
  {
    id: 'u5',
    username: 'you',
    displayName: 'You',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
    isVerified: false,
  },
];
