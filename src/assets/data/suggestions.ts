/**
 * Mock suggestions – import from assets/data for "Suggestions for you" section.
 */

export interface Suggestion {
  userId: string;
  reason: string;
  mutualCount?: number;
}

export const suggestions: Suggestion[] = [
  { userId: 'u4', reason: 'Followed by web_teacher and 2 others', mutualCount: 2 },
  { userId: 'u1', reason: 'Followed by frontend_fan', mutualCount: 1 },
  { userId: 'u3', reason: 'Suggested for you', mutualCount: 0 },
];
