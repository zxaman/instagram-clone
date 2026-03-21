# Phase 9 - Profile Page (Instagram-style header, tabs, highlights, and hover overlay)

## Goal

Build a complete Profile page and replace the `/profile` placeholder with an Instagram-like experience:

- Profile header (avatar, username, action buttons)
- Stats row (posts / followers / following)
- Bio section
- Story highlights row
- Icon-based tabs (`POSTS`, `SAVED`, `TAGGED`)
- 3-column post grid
- Desktop hover overlay (likes + comments count)

---

## What you will learn

| Concept | Where it appears |
|---------|------------------|
| Signals for UI state | `activeTab` controls selected profile tab |
| Computed signals | `userPosts`, `savedPosts`, `taggedPosts`, `visiblePosts` |
| Tab-driven filtering | one grid component with three content modes |
| Standalone icon imports | `LucideAngularModule` + `Heart`, `MessageCircle` |
| Route replacement | `/profile` now renders real profile component |
| Responsive profile layout | desktop-focused layout with mobile fallback |

---

## Files created / modified

| # | File | Action |
|---|------|--------|
| 1 | `src/app/features/profile/profile.component.ts` | Create |
| 2 | `src/app/features/profile/profile.component.html` | Create |
| 3 | `src/app/features/profile/profile.component.scss` | Create |
| 4 | `src/app/app.routes.ts` | Modify - `/profile` route now uses `ProfileComponent` |

---

## Step-by-step

### 1. Profile component logic - `src/app/features/profile/profile.component.ts`

This component manages tab state, prepares filtered datasets, and exposes overlay icons.

```ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Heart, MessageCircle } from '../../core/icons';
import { posts } from '../../../assets/data/posts';
import { users } from '../../../assets/data/users';
import type { Post } from '../../../assets/data';

const CURRENT_USER_ID = 'u5';

type ProfileTab = 'posts' | 'saved' | 'tagged';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;

  readonly activeTab = signal<ProfileTab>('posts');

  readonly currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;

  readonly userPosts = computed<Post[]>(() => {
    const own = posts.filter((p) => p.userId === CURRENT_USER_ID);
    return own.length > 0 ? own : posts;
  });

  readonly savedPosts = computed<Post[]>(() =>
    this.userPosts().filter((p) => p.isSaved)
  );

  readonly taggedPosts = computed<Post[]>(() =>
    this.userPosts().filter((p) => p.commentsCount >= 10)
  );

  readonly postsCount = computed(() => this.userPosts().length);

  readonly visiblePosts = computed<Post[]>(() => {
    const tab = this.activeTab();
    if (tab === 'saved') return this.savedPosts();
    if (tab === 'tagged') return this.taggedPosts();
    return this.userPosts();
  });

  setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  formatCount(value: number): string {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
}
```

---

### 2. Profile template - `src/app/features/profile/profile.component.html`

Contains header, stats, highlights, icon tabs, responsive grid, and desktop hover overlay.

```html
<section class="profile">
  <header class="profile__header">
    <div class="profile__avatar-wrap">
      <img
        [src]="currentUser.avatarUrl"
        [alt]="currentUser.displayName"
        class="profile__avatar"
        width="150"
        height="150"
      />
    </div>

    <div class="profile__meta">
      <div class="profile__top-row">
        <h1 class="profile__username">{{ currentUser.username }}</h1>
        <button type="button" class="profile__action-btn">Edit profile</button>
        <button type="button" class="profile__action-btn profile__action-btn--ghost">View archive</button>
      </div>

      <ul class="profile__stats" aria-label="Profile stats">
        <li class="profile__stat-item">
          <span class="profile__stat-value">{{ postsCount() }}</span>
          <span class="profile__stat-label">posts</span>
        </li>
        <li class="profile__stat-item">
          <span class="profile__stat-value">{{ formatCount(1284) }}</span>
          <span class="profile__stat-label">followers</span>
        </li>
        <li class="profile__stat-item">
          <span class="profile__stat-value">{{ formatCount(412) }}</span>
          <span class="profile__stat-label">following</span>
        </li>
      </ul>

      <div class="profile__bio">
        <h2 class="profile__display-name">{{ currentUser.displayName }}</h2>
        <p class="profile__bio-text">Frontend developer building an Instagram clone with Angular.</p>
      </div>
    </div>
  </header>

  <section class="profile__highlights" aria-label="Story highlights">
    <button type="button" class="profile__highlight-item" aria-label="New highlight">
      <span class="profile__highlight-ring">
        <span class="profile__highlight-plus">+</span>
      </span>
      <span class="profile__highlight-label">New</span>
    </button>
  </section>

  <nav class="profile__tabs" aria-label="Profile content tabs">
    <button
      type="button"
      class="profile__tab"
      [class.profile__tab--active]="activeTab() === 'posts'"
      (click)="setTab('posts')"
      aria-label="Posts"
    >
      <span class="profile__tab-icon profile__tab-icon--posts" aria-hidden="true"></span>
      <span class="profile__tab-text">POSTS</span>
    </button>
    <button
      type="button"
      class="profile__tab"
      [class.profile__tab--active]="activeTab() === 'saved'"
      (click)="setTab('saved')"
      aria-label="Saved"
    >
      <span class="profile__tab-icon profile__tab-icon--saved" aria-hidden="true"></span>
      <span class="profile__tab-text">SAVED</span>
    </button>
    <button
      type="button"
      class="profile__tab"
      [class.profile__tab--active]="activeTab() === 'tagged'"
      (click)="setTab('tagged')"
      aria-label="Tagged"
    >
      <span class="profile__tab-icon profile__tab-icon--tagged" aria-hidden="true"></span>
      <span class="profile__tab-text">TAGGED</span>
    </button>
  </nav>

  @if (visiblePosts().length > 0) {
    <div class="profile__grid">
      @for (post of visiblePosts(); track post.id) {
        <article class="profile__grid-item">
          <img
            [src]="post.imageUrl"
            [alt]="post.caption"
            class="profile__grid-image"
            width="320"
            height="320"
          />

          <div class="profile__grid-overlay" aria-hidden="true">
            <span class="profile__overlay-metric">
              <lucide-icon [img]="Heart" [size]="16" [strokeWidth]="2.25"></lucide-icon>
              <span>{{ formatCount(post.likesCount) }}</span>
            </span>
            <span class="profile__overlay-metric">
              <lucide-icon [img]="MessageCircle" [size]="16" [strokeWidth]="2.25"></lucide-icon>
              <span>{{ formatCount(post.commentsCount) }}</span>
            </span>
          </div>
        </article>
      }
    </div>
  } @else {
    <div class="profile__empty">
      <h3 class="profile__empty-title">No posts yet</h3>
      <p class="profile__empty-text">New posts will appear here.</p>
    </div>
  }
</section>
```

---

### 3. Profile styles - `src/app/features/profile/profile.component.scss`

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;

.profile {
  width: 100%;
  max-width: 935px;
  min-height: 100vh;
  padding: $space-8 $space-6;
  margin: 0 auto;
}

.profile__header {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: $space-8;
  margin-bottom: $space-8;
}

.profile__avatar-wrap {
  @include flex-center;
}

.profile__avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.profile__meta {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.profile__top-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $space-3;
}

.profile__username {
  margin: 0;
  font-size: 28px;
  font-weight: $font-weight-normal;
  color: $text-primary;
}

.profile__action-btn {
  border: 1px solid $border-secondary;
  background: $bg-elevated;
  color: $text-primary;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  padding: $space-2 $space-3;
  border-radius: 8px;
  cursor: pointer;

  &--ghost {
    background: transparent;
  }
}

.profile__stats {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  gap: $space-8;
}

.profile__stat-item {
  display: flex;
  align-items: baseline;
  gap: $space-1;
}

.profile__stat-value {
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.profile__stat-label {
  font-size: $font-size-base;
  color: $text-primary;
}

.profile__bio {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.profile__display-name {
  margin: 0;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.profile__bio-text {
  margin: 0;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.profile__highlights {
  display: flex;
  align-items: center;
  gap: $space-3;
  margin-bottom: $space-6;
}

.profile__highlight-item {
  background: transparent;
  border: none;
  color: $text-primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
  cursor: pointer;
  padding: 0;
}

.profile__highlight-ring {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  border: 2px solid $border-secondary;
  @include flex-center;
}

.profile__highlight-plus {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  border: 1px solid $border-primary;
  background: $bg-elevated;
  @include flex-center;
  font-size: 36px;
  line-height: 1;
  color: $text-secondary;
}

.profile__highlight-label {
  font-size: $font-size-xs;
  color: $text-primary;
}

.profile__tabs {
  border-top: 1px solid $border-primary;
  display: flex;
  justify-content: center;
  gap: $space-8;
  margin-bottom: $space-5;
}

.profile__tab {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 0;
  border: none;
  border-top: 1px solid transparent;
  margin-top: -1px;
  background: transparent;
  color: $text-muted;
  font-size: 12px;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.08em;
  cursor: pointer;

  &--active {
    color: $text-primary;
    border-top-color: $text-primary;
  }
}

.profile__tab-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  color: currentColor;
  position: relative;
}

.profile__tab-icon--posts {
  border: 1px solid currentColor;
  box-shadow:
    inset -4px 0 0 0 transparent,
    inset 4px 0 0 0 transparent;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: currentColor;
  }

  &::before {
    width: 1px;
    height: 100%;
    left: 3px;
    top: 0;
    box-shadow: 4px 0 0 currentColor;
  }

  &::after {
    width: 100%;
    height: 1px;
    top: 3px;
    left: 0;
    box-shadow: 0 4px 0 currentColor;
  }
}

.profile__tab-icon--saved {
  width: 10px;
  border: 1px solid currentColor;
  border-bottom: none;

  &::after {
    content: '';
    position: absolute;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid currentColor;
  }
}

.profile__tab-icon--tagged {
  width: 11px;
  height: 11px;
  border: 1px solid currentColor;
  border-radius: 2px;

  &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: currentColor;
    top: 3px;
    left: 3px;
  }
}

.profile__tab-text {
  font-size: 12px;
  letter-spacing: 0.08em;
}

.profile__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: $space-1;
  width: 100%;
}

.profile__grid-item {
  position: relative;
  aspect-ratio: 1 / 1;
  background: $bg-secondary;
}

.profile__grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.profile__grid-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-6;
  background: rgb(0 0 0 / 35%);
  color: $text-primary;
  opacity: 0;
  transition: opacity 0.18s ease;
  pointer-events: none;
}

.profile__overlay-metric {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
}

.profile__empty {
  padding: $space-10 0;
  text-align: center;
}

.profile__empty-title {
  margin: 0 0 $space-2;
  color: $text-primary;
  font-size: $font-size-lg;
}

.profile__empty-text {
  margin: 0;
  color: $text-secondary;
  font-size: $font-size-sm;
}

@media (max-width: 900px) {
  .profile {
    padding: $space-6 $space-3;
  }

  .profile__header {
    grid-template-columns: 1fr;
    gap: $space-4;
  }

  .profile__avatar {
    width: 96px;
    height: 96px;
  }

  .profile__tabs {
    gap: $space-4;
  }

  .profile__highlights {
    margin-bottom: $space-4;
  }

  .profile__highlight-ring {
    width: 66px;
    height: 66px;
  }

  .profile__highlight-plus {
    width: 56px;
    height: 56px;
    font-size: 28px;
  }

  .profile__tab-text {
    display: none;
  }

  .profile__grid {
    gap: 2px;
  }

  .profile__grid-overlay {
    display: none;
  }
}

@media (hover: hover) and (pointer: fine) {
  .profile__grid-item:hover .profile__grid-overlay {
    opacity: 1;
  }
}
```

---

### 4. Route update - `src/app/app.routes.ts`

Make sure `/profile` uses the real component:

```ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';
import { MessagesComponent } from './features/messages/messages.component';
import { ReelsComponent } from './features/reels/reels.component';
import { ProfileComponent } from './features/profile/profile.component';

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
      { path: 'profile', component: ProfileComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
```

---

## Instagram UI features replicated

| Feature | Implementation |
|---------|----------------|
| Large profile header | avatar + username + action buttons |
| Stats row | compact post/follower/following metrics |
| Profile bio section | display name + one-line bio text |
| Story highlights row | round highlight item with `New` bubble |
| Icon tabs | posts/saved/tagged icon tabs with active top border |
| 3-column grid | square media layout like Instagram profile |
| Desktop hover overlay | likes + comments shown on hover |
| Empty fallback | friendly empty-state for tabs without content |

---

## Verify

```bash
ng build
ng serve
```

Navigate to `/profile` and confirm:

1. Placeholder is replaced by the real profile page.
2. Header shows avatar, username, stats, and bio.
3. Highlights row appears above tabs.
4. Tabs switch between `POSTS`, `SAVED`, and `TAGGED` views.
5. Grid remains 3-column and responsive.
6. On desktop hover, each post shows likes/comments overlay.
