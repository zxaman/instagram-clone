# Phase 8 – Reels Page (Instagram-style vertical reels feed)

## Goal

Build a dedicated **Reels page** that replaces the placeholder route and feels close to Instagram web reels:

- **Vertical reel cards** with 9:16 media.
- **One-step reel scrolling** (scroll snap: one reel per movement).
- **Overlay metadata** (user, caption, audio/time).
- **Right-side action rail** (like, comment, share).
- **Top feed tabs** (For you / Following).
- **Interactive likes** using Angular signals.
- **Keyboard + on-screen navigation controls** (up/down).

---

## What you will learn

| Concept | Where it appears |
|---------|------------------|
| **Signals for local state** (`signal`) | Reels list state and active tab |
| **Derived view model** (`computed`) | `reelsWithUsers` merges reel + user data |
| **Immutable state updates** | `toggleLike()` updates one reel in-place functionally |
| **Programmatic scrolling** | `prevReel()` / `nextReel()` with smooth `scrollTo` |
| **Route replacement** | `/reels` points to a real feature component |
| **Layered UI styling** | gradient overlay + floating action rail on media cards |
| **Immersive route layout** | Hide right "Suggested for you" sidebar on `/reels` |

---

## Files created / modified

| # | File | Action |
|---|------|--------|
| 1 | `src/assets/data/reels.ts` | **Create** |
| 2 | `src/assets/data/index.ts` | **Modify** – export reels data |
| 3 | `src/app/features/reels/reels.component.ts` | **Create** |
| 4 | `src/app/features/reels/reels.component.html` | **Create** |
| 5 | `src/app/features/reels/reels.component.scss` | **Create** |
| 6 | `src/app/core/icons.ts` | **Modify** – add `ChevronUp` |
| 7 | `src/app/app.routes.ts` | **Modify** – `/reels` route |
| 8 | `src/app/layout/main-layout/main-layout.component.ts` | **Modify** – immersive route detection |
| 9 | `src/app/layout/main-layout/main-layout.component.html` | **Modify** – hide right sidebar on immersive routes |

---

## Step-by-step

### 1. Mock data — `src/assets/data/reels.ts`

Create a new data source dedicated to reels.

```ts
/**
 * Mock reels data for the Reels page.
 */

export interface Reel {
  id: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  isLiked?: boolean;
}

export const reels: Reel[] = [
  {
    id: 'r1',
    userId: 'u1',
    mediaUrl: 'https://picsum.photos/540/960?random=31',
    caption: 'Angular signals + clean UI = productive weekend build.',
    audioTitle: 'Original audio - angular_dev',
    likesCount: 1824,
    commentsCount: 93,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isLiked: false,
  },
  {
    id: 'r2',
    userId: 'u2',
    mediaUrl: 'https://picsum.photos/540/960?random=32',
    caption: 'Teaching component architecture in 45 seconds.',
    audioTitle: 'Mentor Mode - web_teacher',
    likesCount: 3210,
    commentsCount: 148,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isLiked: true,
  },
  {
    id: 'r3',
    userId: 'u3',
    mediaUrl: 'https://picsum.photos/540/960?random=33',
    caption: 'Tiny animations that make interfaces feel alive.',
    audioTitle: 'Frontend Flow - frontend_fan',
    likesCount: 2764,
    commentsCount: 117,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isLiked: false,
  },
  {
    id: 'r4',
    userId: 'u4',
    mediaUrl: 'https://picsum.photos/540/960?random=34',
    caption: 'From placeholder to polished page in one sprint.',
    audioTitle: 'Code Sprint - code_explorer',
    likesCount: 1498,
    commentsCount: 61,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isLiked: false,
  },
];
```

---

### 2. Update barrel export — `src/assets/data/index.ts`

```ts
/**
 * Central export for all mock data – import from assets/data.
 */

export { users, type User } from './users';
export { stories, type Story } from './stories';
export { posts, type Post } from './posts';
export { comments, type Comment } from './comments';
export { suggestions, type Suggestion } from './suggestions';
export { notifications, type Notification, type NotificationType } from './notifications';
export { conversations, type Conversation } from './conversations';
export { messages, type Message } from './messages';
export { notes, type Note } from './notes';
export { reels, type Reel } from './reels';
```

---

### 3. Reels component — TypeScript (`src/app/features/reels/reels.component.ts`)

Handles tabs, reel state, like interactions, one-step wheel scroll, keyboard navigation, and programmatic up/down controls.

```ts
import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Heart, MessageCircle, Send, MoreHorizontal, ChevronUp, ChevronDown } from '../../core/icons';
import { reels as reelsData } from '../../../assets/data/reels';
import type { Reel } from '../../../assets/data/reels';
import { users } from '../../../assets/data/users';
import type { User } from '../../../assets/data';

type ReelWithUser = Reel & { user: User | null };

@Component({
  selector: 'app-reels',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './reels.component.html',
  styleUrl: './reels.component.scss',
  host: {
    '(window:keydown)': 'onWindowKeydown($event)',
  },
})
export class ReelsComponent {
  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  readonly MoreHorizontal = MoreHorizontal;
  readonly ChevronUp = ChevronUp;
  readonly ChevronDown = ChevronDown;

  readonly activeTab = signal<'for-you' | 'following'>('for-you');
  readonly reels = signal<Reel[]>([...reelsData]);
  readonly activeIndex = signal(0);

  @ViewChild('reelsList') private reelsListRef?: ElementRef<HTMLDivElement>;
  private wheelLocked = false;

  readonly reelsWithUsers = computed<ReelWithUser[]>(() =>
    this.reels().map((reel) => ({
      ...reel,
      user: this.getUserById(reel.userId) ?? null,
    }))
  );

  setTab(tab: 'for-you' | 'following'): void {
    this.activeTab.set(tab);
  }

  prevReel(): void {
    const current = this.activeIndex();
    this.scrollToIndex(current - 1);
  }

  nextReel(): void {
    const current = this.activeIndex();
    this.scrollToIndex(current + 1);
  }

  onListScroll(): void {
    const list = this.reelsListRef?.nativeElement;
    if (!list) return;

    const snapItems = list.querySelectorAll<HTMLElement>('.reels__snap');
    if (!snapItems.length) return;

    const listTop = list.scrollTop;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    snapItems.forEach((item, index) => {
      const distance = Math.abs(item.offsetTop - listTop);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    this.activeIndex.set(nearestIndex);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (this.wheelLocked) return;

    this.wheelLocked = true;
    if (event.deltaY > 0) {
      this.nextReel();
    } else if (event.deltaY < 0) {
      this.prevReel();
    }

    setTimeout(() => {
      this.wheelLocked = false;
    }, 280);
  }

  onWindowKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target) {
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
    }

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      this.nextReel();
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      this.prevReel();
    }
  }

  toggleLike(reelId: string): void {
    this.reels.update((list) =>
      list.map((reel) => {
        if (reel.id !== reelId) {
          return reel;
        }

        const currentlyLiked = reel.isLiked ?? false;
        return {
          ...reel,
          isLiked: !currentlyLiked,
          likesCount: currentlyLiked ? reel.likesCount - 1 : reel.likesCount + 1,
        };
      })
    );
  }

  relativeTime(iso: string): string {
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diffSec < 60) return 'now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d`;
    return `${Math.floor(diffSec / 604800)}w`;
  }

  private getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  private scrollToIndex(index: number): void {
    const list = this.reelsListRef?.nativeElement;
    if (!list) return;

    const snapItems = list.querySelectorAll<HTMLElement>('.reels__snap');
    if (!snapItems.length) return;

    const clampedIndex = Math.max(0, Math.min(index, snapItems.length - 1));
    const target = snapItems.item(clampedIndex);
    if (!target) return;

    this.activeIndex.set(clampedIndex);
    list.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  }
}
```

---

### 4. Reels component — Template (`src/app/features/reels/reels.component.html`)

Renders tabs and reel cards with overlay metadata/actions.

```html
<section class="reels">
  <header class="reels__header">
    <div class="reels__tabs" role="tablist" aria-label="Reels feed type">
      <button
        type="button"
        class="reels__tab"
        [class.reels__tab--active]="activeTab() === 'for-you'"
        (click)="setTab('for-you')"
      >
        For you
      </button>
      <button
        type="button"
        class="reels__tab"
        [class.reels__tab--active]="activeTab() === 'following'"
        (click)="setTab('following')"
      >
        Following
      </button>
    </div>
  </header>

  <div class="reels__list" #reelsList (scroll)="onListScroll()" (wheel)="onWheel($event)">
    @for (reel of reelsWithUsers(); track reel.id) {
      @if (reel.user; as user) {
        <div class="reels__snap">
          <article class="reel-card" aria-label="Reel by {{ user.username }}">
          <img
            [src]="reel.mediaUrl"
            [alt]="'Reel by ' + user.displayName"
            class="reel-card__media"
            width="540"
            height="960"
          />

          <div class="reel-card__gradient"></div>

          <button type="button" class="reel-card__more" aria-label="More options">
            <lucide-icon [img]="MoreHorizontal" [size]="20"></lucide-icon>
          </button>

          <div class="reel-card__meta">
            <div class="reel-card__author-row">
              <img
                [src]="user.avatarUrl"
                [alt]="user.displayName"
                class="reel-card__avatar"
                width="32"
                height="32"
              />
              <span class="reel-card__username">{{ user.username }}</span>
              <button type="button" class="reel-card__follow-btn">Follow</button>
            </div>

            <p class="reel-card__caption">{{ reel.caption }}</p>
            <p class="reel-card__audio">{{ reel.audioTitle }} • {{ relativeTime(reel.timestamp) }}</p>
          </div>

          <div class="reel-card__actions">
            <button
              type="button"
              class="reel-card__action"
              [class.reel-card__action--liked]="reel.isLiked"
              (click)="toggleLike(reel.id)"
              aria-label="Like reel"
            >
              <lucide-icon [img]="Heart" [size]="28"></lucide-icon>
              <span class="reel-card__action-count">{{ reel.likesCount }}</span>
            </button>

            <button type="button" class="reel-card__action" aria-label="Comment">
              <lucide-icon [img]="MessageCircle" [size]="28"></lucide-icon>
              <span class="reel-card__action-count">{{ reel.commentsCount }}</span>
            </button>

            <button type="button" class="reel-card__action" aria-label="Share">
              <lucide-icon [img]="Send" [size]="28"></lucide-icon>
            </button>
          </div>
          </article>
        </div>
      }
    }
  </div>

  <div class="reels__controls" aria-hidden="false">
    <button
      type="button"
      class="reels__control"
      (click)="prevReel()"
      [disabled]="activeIndex() === 0"
      aria-label="Previous reel"
    >
      <lucide-icon [img]="ChevronUp" [size]="22"></lucide-icon>
    </button>

    <button
      type="button"
      class="reels__control"
      (click)="nextReel()"
      [disabled]="activeIndex() >= reelsWithUsers().length - 1"
      aria-label="Next reel"
    >
      <lucide-icon [img]="ChevronDown" [size]="22"></lucide-icon>
    </button>
  </div>
</section>
```

---

### 5. Reels component — Styles (`src/app/features/reels/reels.component.scss`)

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;

.reels {
  position: relative;
  width: 100%;
  height: 100vh;
  padding: $space-4 $space-6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-4;
  background: $bg-primary;
  overflow: hidden;
}

.reels__header {
  width: 100%;
  max-width: 460px;
  @include flex-center;
}

.reels__tabs {
  display: inline-flex;
  border: 1px solid $border-primary;
  border-radius: 999px;
  overflow: hidden;
}

.reels__tab {
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: $text-secondary;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  cursor: pointer;

  &--active {
    background: $bg-elevated;
    color: $text-primary;
  }
}

.reels__list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  @include hide-scrollbar;
}

.reels__controls {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.reels__control {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: rgba(32, 36, 44, 0.9);
  color: #fff;
  cursor: pointer;
  @include flex-center;
  transition: background 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    background: rgba(57, 66, 79, 0.95);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.reels__snap {
  width: 100%;
  min-height: calc(100vh - 116px);
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.reel-card {
  width: 100%;
  max-width: 420px;
  height: min(80vh, 760px);
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid $border-primary;
  background: $bg-secondary;
  isolation: isolate;
}

.reel-card__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.reel-card__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.35) 35%,
    rgba(0, 0, 0, 0.05) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
}

.reel-card__more {
  position: absolute;
  top: $space-3;
  right: $space-3;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  cursor: pointer;
  @include flex-center;
}

.reel-card__meta {
  position: absolute;
  left: $space-3;
  right: 68px;
  bottom: $space-3;
  color: #fff;
  z-index: 2;
}

.reel-card__author-row {
  display: flex;
  align-items: center;
  gap: $space-2;
  margin-bottom: $space-2;
}

.reel-card__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.reel-card__username {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
}

.reel-card__follow-btn {
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: #fff;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}

.reel-card__caption {
  margin: 0;
  font-size: $font-size-sm;
  line-height: 1.35;
}

.reel-card__audio {
  margin: $space-1 0 0;
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.85);
}

.reel-card__actions {
  position: absolute;
  right: $space-3;
  bottom: $space-3;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
}

.reel-card__action {
  border: none;
  background: transparent;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;

  &--liked {
    color: $error;
  }
}

.reel-card__action-count {
  font-size: 11px;
  font-weight: $font-weight-semibold;
  color: #fff;
}

@media (max-width: 768px) {
  .reels {
    padding: $space-3 $space-2;
    gap: $space-2;
  }

  .reels__snap {
    min-height: calc(100vh - 92px);
  }

  .reel-card {
    width: min(100%, 420px);
    height: min(82vh, 700px);
    border-radius: 12px;
  }

  .reels__controls {
    right: 10px;
    gap: $space-2;
  }

  .reels__control {
    width: 44px;
    height: 44px;
  }
}
```

---

### 6. Icons update — `src/app/core/icons.ts`

Added `ChevronUp` for reel navigation controls. Full current file:

```ts
/**
 * Central registry of Lucide icons used in the app.
 * Import icons from this file in components so we can track usage in one place.
 *
 * Usage in component:
 *   import { LucideAngularModule } from 'lucide-angular';
 *   import { Heart, MessageCircle } from './core/icons';
 *   // Expose on class: readonly Heart = Heart;
 *   // Template: <lucide-icon [img]="Heart" [size]="24"></lucide-icon>
 */

export {
  // Post / feed
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
  // Left sidebar (nav + logo)
  Camera,
  Home,
  Clapperboard,
  Search,
  Compass,
  SquarePlus,
  User,
  // Stories (strip + viewer)
  ChevronLeft,
  ChevronRight,
  X,
  CheckCheck,
  // Messages
  PenSquare,
  Info,
  Phone,
  Video,
  Image,
  Smile,
  ChevronUp,
  ChevronDown,
} from 'lucide-angular';

/** List of icon names in use – for documentation and tracking. */
export const ICONS_IN_USE = [
  'Heart',
  'MessageCircle',
  'Send',
  'Bookmark',
  'MoreHorizontal',
  'BadgeCheck',
  'Camera',
  'Home',
  'Clapperboard',
  'Search',
  'Compass',
  'SquarePlus',
  'User',
  'ChevronLeft',
  'ChevronRight',
  'X',
  'CheckCheck',
  'PenSquare',
  'Info',
  'Phone',
  'Video',
  'Image',
  'Smile',
  'ChevronUp',
  'ChevronDown',
] as const;
```

---

### 7. Route update — `src/app/app.routes.ts`

Replace placeholder route with the real component.

```ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';
import { MessagesComponent } from './features/messages/messages.component';
import { ReelsComponent } from './features/reels/reels.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'search', redirectTo: '', pathMatch: 'full' },
      { path: 'notifications', redirectTo: '', pathMatch: 'full' },
      { path: 'explore', component: PlaceholderComponent, data: { pageName: 'Explore' } },
      { path: 'reels', component: ReelsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'create', component: PlaceholderComponent, data: { pageName: 'Create' } },
      { path: 'profile', component: PlaceholderComponent, data: { pageName: 'Profile' } },
    ],
  },
  { path: '**', redirectTo: '' },
];
```

---

### 8. Immersive layout for Reels — `src/app/layout/main-layout/*`

To match Instagram Reels experience, the right "Suggested for you" sidebar is hidden on `/reels` (same as `/messages`).

`main-layout.component.ts`

```ts
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { SearchSidebarComponent } from '../../features/search/search-sidebar.component';
import { NotificationsSidebarComponent } from '../../features/notifications/notifications-sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    LeftSidebarComponent,
    RightSidebarComponent,
    RouterOutlet,
    SearchSidebarComponent,
    NotificationsSidebarComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly router = inject(Router);

  readonly isImmersiveRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
      map((url) => {
        const [path] = url.split('?');
        return path === '/messages' || path === '/reels';
      })
    ),
    {
      initialValue:
        this.router.url.split('?')[0] === '/messages' ||
        this.router.url.split('?')[0] === '/reels',
    }
  );
}
```

`main-layout.component.html`

```html
<div class="layout">
  <aside class="layout__left">
    <app-left-sidebar />
  </aside>
  <main class="layout__center" [class.layout__center--full-width]="isImmersiveRoute()">
    <router-outlet />
  </main>
  @if (!isImmersiveRoute()) {
    <aside class="layout__right">
      <app-right-sidebar />
    </aside>
  }
  <app-search-sidebar />
  <app-notifications-sidebar />
</div>
```

---

## Instagram UI features replicated

| Feature | Implementation |
|---------|----------------|
| One-reel scroll behavior | `scroll-snap` + wheel interception for one-step reel movement |
| Vertical reel format | full-height snap cards with immersive viewport |
| Overlay content | bottom metadata block + gradient legibility layer |
| Action rail | stacked right-side Like / Comment / Share icons |
| Reel header controls | top-right more options button |
| Reel navigation controls | fixed circular up/down buttons on the right |
| Feed mode tabs | For you / Following pills with active state |
| Interactive likes | heart state + count update via signal |
| Keyboard navigation | `ArrowUp`/`ArrowDown` and `PageUp`/`PageDown` switch reels |
| No "Suggested for you" panel | right sidebar hidden on `/reels` immersive layout |

---

## Verify

```bash
ng build
ng serve
```

Navigate to `/reels` and confirm:
1. Placeholder is replaced by the Reels page.
2. Each wheel scroll moves exactly one reel (snap behavior).
3. Up/down floating controls navigate to previous/next reel.
4. ArrowUp/ArrowDown keys also navigate reels.
5. Like button toggles and updates count.
6. User/caption/audio overlays appear over each reel.
7. Right "Suggested for you" sidebar is hidden on `/reels`.
