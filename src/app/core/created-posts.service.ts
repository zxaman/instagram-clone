import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { posts, type Post } from '../../assets/data/posts';

const CREATED_POSTS_STORAGE_KEY = 'instagram-clone:create-posts';
const CURRENT_USER_ID = 'u5';

type PrivacyOption = 'Public' | 'Followers' | 'Close Friends';
type AspectRatio = 'square' | 'portrait' | 'landscape';

export interface CreatedPost {
  id: string;
  imageUrl: string;
  aspectRatio: AspectRatio;
  caption: string;
  location: string;
  privacy: PrivacyOption;
  commentsEnabled: boolean;
  hideLikeCount: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CreatedPostsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly createdPostsState = signal<CreatedPost[]>([]);

  readonly createdPosts = this.createdPostsState.asReadonly();

  readonly feedPosts = computed<Post[]>(() =>
    this.createdPostsState().map((item) => this.toPost(item))
  );

  constructor() {
    this.loadFromStorage();
  }

  add(post: CreatedPost): void {
    this.createdPostsState.update((items) => {
      const next = [post, ...items];
      this.saveToStorage(next);
      return next;
    });
  }

  private toPost(item: CreatedPost): Post {
    return {
      id: item.id,
      userId: CURRENT_USER_ID,
      imageUrl: item.imageUrl,
      caption: item.caption,
      likesCount: item.hideLikeCount ? 0 : 1,
      commentsCount: 0,
      timestamp: item.createdAt,
      isLiked: false,
      isSaved: false,
    };
  }

  private loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const raw = localStorage.getItem(CREATED_POSTS_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return;
      }

      const valid = parsed.filter((item): item is CreatedPost => {
        return (
          typeof item?.id === 'string' &&
          typeof item?.imageUrl === 'string' &&
          typeof item?.aspectRatio === 'string' &&
          typeof item?.caption === 'string' &&
          typeof item?.location === 'string' &&
          typeof item?.privacy === 'string' &&
          typeof item?.commentsEnabled === 'boolean' &&
          typeof item?.hideLikeCount === 'boolean' &&
          typeof item?.createdAt === 'string'
        );
      });

      this.createdPostsState.set(valid);
    } catch {
      this.createdPostsState.set([]);
    }
  }

  private saveToStorage(postsToSave: CreatedPost[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.setItem(CREATED_POSTS_STORAGE_KEY, JSON.stringify(postsToSave));
    } catch {
      // Ignore write failures and keep in-memory state available.
    }
  }
}
