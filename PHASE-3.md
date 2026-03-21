# Phase 3 – Stories Section (What We Did & Why)

> Sync note (2026-03-21): Phase 3 code blocks were checked and kept as the intended Phase 3 snapshot. Later shared-file changes are documented in Phase 5+ and Phase 7/8.

This document explains **everything we did in Phase 3** in simple terms and gives the **full code** for each file you created or updated, so you can follow phase by phase.

---

## What is Phase 3?

**Phase 3 adds the Stories section** at the top of the home (feed) area:

1. **Horizontal strip** of story rings – "Your story" first (current user’s avatar), then other users’ stories from `assets/data/stories.ts`.
2. **Story ring styling** – gradient ring for unseen stories, gray ring for seen; horizontal scroll with no scrollbar.
3. **Stories integrated into Home** – the Home view now shows the stories strip, then the placeholder (feed will replace the placeholder in Phase 4).
4. **Story viewer** – clicking a story with media opens an overlay that shows the story image, the user’s avatar and username, and a close button. Clicking the backdrop or close button dismisses it.

Data comes from **assets/data** (users, stories). Logic stays in TS, structure in HTML, styling in SCSS.

---

## 1. Stories Component (Horizontal Strip + Viewer)

### What we did

- **StoriesComponent** shows a horizontal scroll of items:
  - First item: **"Your story"** – current user’s avatar (from `users[4]`), no gradient ring (neutral border).
  - Rest: one item per **other** story (we filter out the current user’s story). Each has a **story ring** (gradient or gray if `seen`), avatar, and username below.
- **Data:** `stories` and `users` are imported from assets. We use `getUserById()` to resolve each story’s user for avatar and username.
- **Click:** Only stories that have `mediaUrl` open the viewer. "Your story" does not open the viewer.
- **Viewer:** Full-screen overlay (backdrop + content). Shows story image, header with user avatar and username, and a close button. Backdrop click or close button sets `selectedStory` to `null`. **Icons** (ChevronLeft, ChevronRight, X for close and strip arrows) are imported from **`src/app/core/icons.ts`**.

### Files we created

- `src/app/features/stories/stories.component.ts` – data (current user, stories list), `getUserById`, `otherStories` getter, `onStoryClick`, `selectedStory`, `closeViewer`.
- `src/app/features/stories/stories.component.html` – structure: scroll container, "Your story" button, `@for` over `otherStories` with story ring buttons, and `@if (selectedStory)` viewer block.
- `src/app/features/stories/stories.component.scss` – layout (flex, horizontal scroll, hide scrollbar), story ring (gradient/gray), viewer overlay and content.

---

## 2. Home Component Updates

### What we did

- **Home** now includes `<app-stories />` at the top and the existing placeholder below.
- **Layout:** Wrapper `.home` with `max-width: $feed-max-width` so the feed area (and stories) stay centered and match the intended feed width. Placeholder text updated to "Phase 3 – Stories added. Feed next."

### Files we updated

- `src/app/features/home/home.component.ts` – import and add `StoriesComponent` to `imports`.
- `src/app/features/home/home.component.html` – wrap content in `.home`, add `<app-stories />`, then the placeholder div.
- `src/app/features/home/home.component.scss` – styles for `.home` (width, max-width, flex column, align center) and keep `.home-placeholder` styles; remove `min-height: 100vh` from placeholder so the page flows naturally.

---

## 3. Folder Structure After Phase 3

```
src/app/
├── core/
│   ├── story-viewer.service.ts   (new)
│   ├── icons.ts
│   └── svgs.ts                   (custom SVG registry; no inline SVG)
├── features/
│   ├── home/
│   │   ├── home.component.ts    (updated – imports StoriesComponent)
│   │   ├── home.component.html  (updated – app-stories + placeholder)
│   │   └── home.component.scss  (updated – .home wrapper)
│   ├── stories/                  (new)
│   │   ├── stories.component.ts
│   │   ├── stories.component.html
│   │   └── stories.component.scss
│   └── placeholder/
│       └── ...
└── layout/
    └── ...
```

---

## 4. Rules We Still Follow

| Rule              | Phase 3 usage |
|-------------------|----------------|
| **HTML = structure** | Story items, buttons, viewer overlay, no inline styles. |
| **SCSS = styling**   | Story ring, scroll, viewer layout and theme variables. |
| **TS = logic**       | Data from assets, `getUserById`, `feedStories`, StoryViewerService, progress timer. |
| **Data in assets**   | `users` and `stories` from `assets/data`. |
| **Icons / SVGs**     | Use Lucide via `src/app/core/icons.ts` (ChevronLeft, ChevronRight, X). No inline SVG; custom SVGs go in `src/app/core/svgs.ts`. |

---

## 5. Complete Code for Phase 3 (Copy Exactly)

**Use this after Phase 2.** New files: `story-viewer.service.ts`, Stories component. Icons come from `core/icons.ts` (no inline SVG).

---

### New in Phase 3: `src/app/core/story-viewer.service.ts`

```ts
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

  get currentViewSignal() {
    return this.currentView;
  }

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
```

---

### New in Phase 3: `src/app/features/stories/stories.component.ts`

```ts
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

  get feedStories(): Story[] {
    return this.storiesList.filter((s) => s.userId !== this.currentUser.id);
  }

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
  }

  goNext(): void {
    this.progressElapsed.set(0);
    this.viewerService.goNext();
    if (!this.viewerService.getCurrent()) {
      this.clearProgressTimer();
    }
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
```

---

### New in Phase 3: `src/app/features/stories/stories.component.html`

```html
<div class="stories">
  <div class="stories__strip">
    <button
      type="button"
      class="stories__arrow stories__arrow--left"
      aria-label="Scroll stories left"
      (click)="scrollStrip('left')"
    >
      <lucide-icon [img]="ChevronLeft" [size]="24"></lucide-icon>
    </button>
    <div class="stories__scroll" #scrollContainer>
      @for (item of feedStories; track item.id) {
        @let user = getUserById(item.userId);
        @if (user) {
          <div class="stories__item">
            <button
              type="button"
              class="story-ring"
              [class.story-ring--seen]="item.seen"
              (click)="onStoryClick(item)"
              [attr.aria-label]="'View story from ' + user.username"
            >
              <span class="story-ring__avatar-wrap">
                <img
                  [src]="user.avatarUrl"
                  [alt]="user.displayName"
                  class="story-ring__avatar"
                  width="56"
                  height="56"
                />
              </span>
              <span class="stories__label">{{ user.username }}</span>
            </button>
          </div>
        }
      }
    </div>
    <button
      type="button"
      class="stories__arrow stories__arrow--right"
      aria-label="Scroll stories right"
      (click)="scrollStrip('right')"
    >
      <lucide-icon [img]="ChevronRight" [size]="24"></lucide-icon>
    </button>
  </div>

  @if (viewerActive && currentView) {
    <div class="stories-viewer" role="dialog" aria-modal="true" aria-label="Story">
      <div class="stories-viewer__backdrop" (click)="closeViewer()"></div>
      <div class="stories-viewer__content">
        <button
          type="button"
          class="stories-viewer__close"
          aria-label="Close"
          (click)="closeViewer()"
        >
          <lucide-icon [img]="X" [size]="24"></lucide-icon>
        </button>

        <div class="stories-viewer__progress">
          <div class="stories-viewer__progress-bar" [style.width.%]="progressPercent()"></div>
        </div>

        @if (currentIndex > 0) {
          <button
            type="button"
            class="stories-viewer__nav stories-viewer__nav--prev"
            aria-label="Previous story"
            (click)="goPrev()"
          >
            <lucide-icon [img]="ChevronLeft" [size]="24"></lucide-icon>
          </button>
        }
        @if (currentIndex >= 0 && currentIndex < queueLength - 1) {
          <button
            type="button"
            class="stories-viewer__nav stories-viewer__nav--next"
            aria-label="Next story"
            (click)="goNext()"
          >
            <lucide-icon [img]="ChevronRight" [size]="24"></lucide-icon>
          </button>
        }

        <div class="stories-viewer__header">
          <img
            [src]="currentView!.user.avatarUrl"
            [alt]="currentView!.user.displayName"
            class="stories-viewer__avatar"
            width="32"
            height="32"
          />
          <span class="stories-viewer__username">{{ currentView!.user.username }}</span>
        </div>
        @if (currentView!.story.mediaUrl) {
          <img
            [src]="currentView!.story.mediaUrl"
            [alt]="currentView!.user.username + ' story'"
            class="stories-viewer__media"
          />
        } @else {
          <div class="stories-viewer__placeholder">
            <p>Your story</p>
            <span>Add a photo or video to share with your story.</span>
          </div>
        }
      </div>
    </div>
  }
</div>
```

---

### New in Phase 3: `src/app/features/stories/stories.component.scss`

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;

.stories {
  width: 100%;
  max-width: $feed-max-width;
  padding: $space-4 0;
}

.stories__strip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
}

.stories__arrow {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  @include flex-center;
  color: $text-primary;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid $border-primary;
  z-index: 2;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

.stories__arrow--left {
  margin-right: $space-2;
}

.stories__arrow--right {
  margin-left: $space-2;
}

.stories__scroll {
  flex: 1;
  display: flex;
  gap: $space-4;
  overflow-x: auto;
  padding: $space-2 0 $space-2 $space-4;
  min-width: 0;
  @include hide-scrollbar;
}

.stories__item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
}

.stories__label {
  font-size: $font-size-xs;
  color: $text-primary;
  max-width: 74px;
  @include truncate;
  text-align: center;
}

.story-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
  padding: 0;
  background: none;
  color: inherit;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.story-ring__avatar-wrap {
  padding: 3px;
  border-radius: 50%;
  background: $story-ring-gradient;
  flex-shrink: 0;
}

.story-ring--seen .story-ring__avatar-wrap {
  background: $border-secondary;
}

.story-ring__avatar {
  display: block;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid $bg-primary;
  box-sizing: border-box;
}

.stories-viewer {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-4;
}

.stories-viewer__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
}

.stories-viewer__content {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $bg-secondary;
  border-radius: 8px;
  overflow: hidden;
}

.stories-viewer__progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.3);
}

.stories-viewer__progress-bar {
  height: 100%;
  background-color: $text-primary;
  transition: width 50ms linear;
}

.stories-viewer__close {
  position: absolute;
  top: $space-4;
  right: $space-4;
  z-index: 4;
  width: 36px;
  height: 36px;
  @include flex-center;
  color: $text-primary;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.stories-viewer__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  @include flex-center;
  color: $text-primary;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

.stories-viewer__nav--prev {
  left: $space-4;
}

.stories-viewer__nav--next {
  right: $space-4;
}

.stories-viewer__header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-4 $space-4 $space-4 $space-4;
  padding-top: $space-6;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
}

.stories-viewer__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid $accent;
}

.stories-viewer__username {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.stories-viewer__media {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  display: block;
}

.stories-viewer__placeholder {
  padding: $space-10;
  text-align: center;
  color: $text-secondary;

  p {
    margin: 0 0 $space-2;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }

  span {
    font-size: $font-size-sm;
  }
}
```

---

### Updated in Phase 3: `src/app/features/home/home.component.ts` (complete)

```ts
import { Component } from '@angular/core';
import { StoriesComponent } from '../stories/stories.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
```

---

### Updated in Phase 3: `src/app/features/home/home.component.html` (complete)

```html
<div class="home">
  <app-stories />
  <div class="home-placeholder">
    <h1>Instagram Clone</h1>
    <p>Phase 3 – Stories added. Feed next.</p>
  </div>
</div>
```

---

### Updated in Phase 3: `src/app/features/home/home.component.scss` (complete)

```scss
@use '../../../styles/variables' as *;

.home {
  width: 100%;
  max-width: $feed-max-width;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-10 $space-6;

  h1 {
    margin: 0 0 $space-4;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }

  p {
    margin: 0;
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}
```

---

## 6. How to Run and What to See

```bash
cd instagram-clone
npm start
```

- On **Home** you should see:
  - **Stories** at the top: "Your story" first, then other users’ story rings (gradient or gray if seen), with horizontal scroll.
  - Placeholder text below: "Phase 3 – Stories added. Feed next."
- **Click a story** that has an image: the story viewer opens with the image, user avatar and username, and a close button. Click the backdrop or close to dismiss.

---

## 7. What’s Next (Phase 4)

Phase 4 will add the **Feed**: post list (from `assets/data/posts.ts`), post component (header, image, caption, like/comment/share), and comments from `assets/data/comments.ts`.

---

*This file describes Phase 3 and gives the full code for each file so you can build the project phase by phase.*
