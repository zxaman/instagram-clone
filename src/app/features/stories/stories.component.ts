import { Component, inject, ViewChild, ElementRef, OnDestroy, signal, computed, effect } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ChevronLeft, ChevronRight, X } from '../../core/icons';
import { users } from '../../../assets/data/users';
import { stories } from '../../../assets/data/stories';
import type { User } from '../../../assets/data/users';
import type { Story } from '../../../assets/data/stories';
import { StoryViewerService } from '../../core/story-viewer.service';

const STORY_DURATION_MS = 7000;
const PROGRESS_TICK_MS = 50;

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss',
})
export class StoriesComponent implements OnDestroy {
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly X = X;

  private viewerService = inject(StoryViewerService);

  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef<HTMLElement>;

  currentUser = users[4];
  storiesList = stories;
  private progressTimer: ReturnType<typeof setInterval> | null = null;
  private progressTickTimer: ReturnType<typeof setInterval> | null = null;
  progressElapsed = signal(0);

  constructor() {
    effect(() => {
      const view = this.viewerService.currentViewSignal();
      if (view?.story.mediaUrl) {
        this.progressElapsed.set(0);
        this.startProgressTimer();
      }
    });
  }

  progressPercent = computed(() => {
    const elapsed = this.progressElapsed();
    return Math.min(100, (elapsed / STORY_DURATION_MS) * 100);
  });

  getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  /** Stories to show in the strip (only other users; "Your story" is in the sidebar) */
  get feedStories(): Story[] {
    return this.storiesList.filter((s) => s.userId !== this.currentUser.id);
  }

  /** All story views for the viewer queue (other users only, with media) */
  get storyViewsForViewer(): { story: Story; user: User }[] {
    return this.feedStories
      .filter((s) => s.mediaUrl)
      .map((s) => ({
        story: s,
        user: this.getUserById(s.userId)!,
      }))
      .filter((v) => v.user);
  }

  onStoryClick(story: Story): void {
    const user = this.getUserById(story.userId);
    if (user && story.mediaUrl) {
      this.viewerService.openStory(story, user, this.storyViewsForViewer);
      // Progress timer is started by the effect when currentViewSignal() has a story with media
    }
  }

  scrollStrip(direction: 'left' | 'right'): void {
    const el = this.scrollContainerRef?.nativeElement;
    if (!el) return;
    const step = 200;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.clearProgressTimer();
    this.clearProgressTick();
  }

  get viewerActive(): boolean {
    return this.viewerService.active();
  }

  get currentView(): { story: Story; user: User } | null {
    return this.viewerService.getCurrent();
  }

  get currentIndex(): number {
    return this.viewerService.getCurrentIndex();
  }

  get queueLength(): number {
    return this.viewerService.getQueue().length;
  }

  closeViewer(): void {
    this.clearProgressTimer();
    this.viewerService.close();
  }

  goPrev(): void {
    this.progressElapsed.set(0);
    this.viewerService.goPrev();
    // Effect will start the timer when currentViewSignal() updates
  }

  goNext(): void {
    this.progressElapsed.set(0);
    this.viewerService.goNext();
    if (!this.viewerService.getCurrent()) {
      this.clearProgressTimer();
    }
    // Effect will start the timer when currentViewSignal() updates to next story
  }

  private startProgressTimer(): void {
    this.clearProgressTimer();
    this.clearProgressTick();
    this.progressElapsed.set(0);
    this.progressTickTimer = setInterval(() => {
      const next = this.progressElapsed() + PROGRESS_TICK_MS;
      this.progressElapsed.set(next);
      if (next >= STORY_DURATION_MS) {
        this.clearProgressTick();
      }
    }, PROGRESS_TICK_MS);
    this.progressTimer = setInterval(() => {
      this.clearProgressTick();
      this.viewerService.goNext();
      if (this.viewerService.getCurrent()) {
        this.progressElapsed.set(0);
        this.startProgressTimer();
      } else {
        this.clearProgressTimer();
      }
    }, STORY_DURATION_MS);
  }

  private clearProgressTimer(): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private clearProgressTick(): void {
    if (this.progressTickTimer) {
      clearInterval(this.progressTickTimer);
      this.progressTickTimer = null;
    }
  }
}
