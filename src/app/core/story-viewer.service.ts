import { Injectable, signal, computed } from '@angular/core';
import type { User } from '../../assets/data/users';
import type { Story } from '../../assets/data/stories';

export interface StoryView {
  story: Story;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class StoryViewerService {
  private currentView = signal<StoryView | null>(null);

  /** Exposed so components can react when the viewed story changes (e.g. start progress timer). */
  get currentViewSignal() {
    return this.currentView;
  }

  /** List of all story views (for back/next navigation in viewer) */
  private storyQueue: StoryView[] = [];

  readonly active = computed(() => this.currentView() !== null);

  getCurrent(): StoryView | null {
    return this.currentView();
  }

  getQueue(): StoryView[] {
    return this.storyQueue;
  }

  openStory(story: Story, user: User, allStories: StoryView[]): void {
    this.storyQueue = allStories;
    this.currentView.set({ story, user });
  }

  openYourStory(user: User, yourStory: Story | null): void {
    if (yourStory) {
      this.storyQueue = [{ story: yourStory, user }];
      this.currentView.set({ story: yourStory, user });
    }
  }

  close(): void {
    this.currentView.set(null);
    this.storyQueue = [];
  }

  goNext(): void {
    const current = this.currentView();
    if (!current || this.storyQueue.length === 0) return;
    const idx = this.storyQueue.findIndex(
      (v) => v.story.id === current.story.id && v.user.id === current.user.id
    );
    if (idx < 0 || idx >= this.storyQueue.length - 1) {
      this.close();
      return;
    }
    this.currentView.set(this.storyQueue[idx + 1]);
  }

  goPrev(): void {
    const current = this.currentView();
    if (!current || this.storyQueue.length === 0) return;
    const idx = this.storyQueue.findIndex(
      (v) => v.story.id === current.story.id && v.user.id === current.user.id
    );
    if (idx <= 0) return;
    this.currentView.set(this.storyQueue[idx - 1]);
  }

  getCurrentIndex(): number {
    const current = this.currentView();
    if (!current) return -1;
    return this.storyQueue.findIndex(
      (v) => v.story.id === current.story.id && v.user.id === current.user.id
    );
  }
}
