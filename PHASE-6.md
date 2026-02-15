# Phase 6 – Notifications (Sidebar)

This document describes **Phase 6**: **Notifications** as a **sidebar overlay** (same pattern as Search), not a full page.

---

## What is Phase 6?

**Phase 6 adds Notifications as a sidebar** that opens over the main content:

1. **Open notifications** – Clicking **Notifications** in the left nav opens a **sidebar panel** from the left (does not navigate to a full page). The route `/notifications` redirects to home.
2. **Sidebar panel** – Title "Notifications", close (X) button, optional "Mark all as read" when there are unread items, then a scrollable list of notification items.
3. **Notification item** – Actor avatar, notification text (e.g. "**username** liked your post.", "**username** started following you."), relative time, and an unread indicator (blue dot) when `read` is false. Clicking an item marks it as read.
4. **Mark all as read** – Button marks every notification as read (only shown when there is at least one unread). Data is mutable in memory (from `assets/data/notifications.ts`); current user is the recipient (`userId === 'u5'`).
5. **Close** – Backdrop click or X closes the sidebar.
6. **Data** – Notifications have: `id`, `type` ('like' | 'comment' | 'follow'), `userId`, `actorId`, `postId?`, `text`, `timestamp`, `read`. Users resolved from `assets/data/users.ts`.

---

## 1. Notifications Data

- **`src/assets/data/notifications.ts`** (new):
  - Export interface **Notification** with: `id`, `type`, `userId`, `actorId`, `postId?`, `text`, `timestamp` (ISO string), `read` (boolean).
  - Export array **notifications** – mock list for current user `u5`. Include a few likes, comments, and follows.
- **`src/assets/data/index.ts`** – Export `notifications` and type `Notification`.

---

## 2. NotificationsSidebarService

- **`src/app/core/notifications-sidebar.service.ts`** (providedIn: 'root'):
  - **isOpen** – Readonly signal; **open()**, **close()**, **toggle()**.

---

## 3. Notifications Sidebar Component

- **NotificationsSidebarComponent** at `src/app/features/notifications/notifications-sidebar.component.*`:
  - Renders only when **NotificationsSidebarService.isOpen()** is true: backdrop + panel (slide-in from left).
  - Panel: header ("Notifications" + close X), optional "Mark all as read" button, body (scrollable list of notifications). Each item: avatar, "**username**" + text, relative time, unread dot. Clicking an item calls **markAsRead(id)**.
  - Uses a **writable signal** for the notifications list so we can mark one or all as read. **recentUsers** from service not needed; list comes from local copy of `notifications` data.
- **Main layout** includes `<app-notifications-sidebar />` so the overlay is available on every page.

---

## 4. Left Sidebar

- **Notifications** nav item: **(click)="onNavClick($event, item)"** – when `item.path === '/notifications'` we **preventDefault()** and call **NotificationsSidebarService.open()** so the notifications sidebar opens instead of navigating.

---

## 5. Routing

- **`/notifications`** – **redirectTo: ''** (pathMatch: 'full') so there is no full-page notifications route.

---

## 6. Folder Structure After Phase 6

```
src/app/
├── core/
│   ├── notifications-sidebar.service.ts   (new)
│   ├── search-sidebar.service.ts
│   ├── icons.ts
│   ├── svgs.ts
│   └── story-viewer.service.ts
├── features/
│   └── notifications/
│       ├── notifications-sidebar.component.ts   (sidebar overlay)
│       ├── notifications-sidebar.component.html
│       ├── notifications-sidebar.component.scss
│       ├── notifications.component.ts            (legacy full-page, unused by route)
│       ├── notifications.component.html
│       └── notifications.component.scss
└── layout/
    └── main-layout/   (includes app-notifications-sidebar)
src/assets/data/
├── notifications.ts   (new)
├── index.ts   (updated)
└── ...
```

---

## 7. Rules We Follow

| Rule              | Phase 6 usage |
|-------------------|----------------|
| **HTML = structure** | Notifications header, list, notification rows; no inline styles. |
| **SCSS = styling**   | Sidebar layout, list rows, unread dot, theme variables. |
| **TS = logic**       | Data from assets, writable list for read state, relative time, getUserById. |
| **Data in assets**   | `notifications` and `users` from `assets/data`. |
| **Icons**            | X, CheckCheck from `src/app/core/icons.ts`. No inline SVG. |
| **SVGs**             | Custom SVGs (if needed) go in `src/app/core/svgs.ts`. |

---

## 8. Complete Code for Phase 6 (Copy Exactly)

---

### New in Phase 6: `src/assets/data/notifications.ts`

```ts
/**
 * Mock notifications for the current user (userId 'u5').
 */

export type NotificationType = 'like' | 'comment' | 'follow';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  actorId: string;
  postId?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    userId: 'u5',
    actorId: 'u1',
    postId: 'p1',
    text: 'liked your post.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: 'n2',
    type: 'comment',
    userId: 'u5',
    actorId: 'u2',
    postId: 'p1',
    text: 'commented on your post.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    type: 'follow',
    userId: 'u5',
    actorId: 'u3',
    text: 'started following you.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
  },
  {
    id: 'n4',
    type: 'like',
    userId: 'u5',
    actorId: 'u4',
    postId: 'p2',
    text: 'liked your post.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
];
```

---

### Updated in Phase 6: `src/assets/data/index.ts` (complete)

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
```

---

### New in Phase 6: `src/app/core/notifications-sidebar.service.ts`

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationsSidebarService {
  private readonly _isOpen = signal(false);

  readonly isOpen = this._isOpen.asReadonly();

  open(): void {
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  toggle(): void {
    this._isOpen.update((v) => !v);
  }
}
```

---

### New in Phase 6: `src/app/features/notifications/notifications-sidebar.component.ts`

```ts
import { Component, signal, computed, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { X, CheckCheck } from '../../core/icons';
import { NotificationsSidebarService } from '../../core/notifications-sidebar.service';
import { notifications as initialNotifications } from '../../../assets/data/notifications';
import { users } from '../../../assets/data/users';
import type { Notification } from '../../../assets/data';
import type { User } from '../../../assets/data';

@Component({
  selector: 'app-notifications-sidebar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './notifications-sidebar.component.html',
  styleUrl: './notifications-sidebar.component.scss',
})
export class NotificationsSidebarComponent {
  readonly X = X;
  readonly CheckCheck = CheckCheck;

  private notificationsSidebar = inject(NotificationsSidebarService);

  private _list = signal<Notification[]>([]);

  constructor() {
    this._list.set([...initialNotifications]);
  }

  notifications = this._list.asReadonly();
  hasUnread = computed(() => this._list().some((n) => !n.read));

  get isOpen(): boolean {
    return this.notificationsSidebar.isOpen();
  }

  close(): void {
    this.notificationsSidebar.close();
  }

  getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  relativeTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (sec < 60) return 'Just now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
    if (sec < 2592000) return `${Math.floor(sec / 86400)}d`;
    return d.toLocaleDateString();
  }

  markAsRead(id: string): void {
    this._list.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllAsRead(): void {
    this._list.update((list) => list.map((n) => ({ ...n, read: true })));
  }
}
```

---

### New in Phase 6: `src/app/features/notifications/notifications-sidebar.component.html`

```html
@if (isOpen) {
  <div class="notifications-sidebar">
    <div class="notifications-sidebar__backdrop" (click)="close()" aria-hidden="true"></div>
    <aside class="notifications-sidebar__panel" role="dialog" aria-modal="true" aria-label="Notifications">
      <header class="notifications-sidebar__header">
        <h2 class="notifications-sidebar__title">Notifications</h2>
        <button type="button" class="notifications-sidebar__close" aria-label="Close" (click)="close()">
          <lucide-icon [img]="X" [size]="24"></lucide-icon>
        </button>
      </header>

      @if (hasUnread()) {
        <div class="notifications-sidebar__mark-all-wrap">
          <button type="button" class="notifications-sidebar__mark-all" (click)="markAllAsRead()">
            <lucide-icon [img]="CheckCheck" [size]="20"></lucide-icon>
            Mark all as read
          </button>
        </div>
      }

      <section class="notifications-sidebar__body">
        @if (notifications().length === 0) {
          <p class="notifications-sidebar__empty">No notifications yet.</p>
        } @else {
          <ul class="notifications-sidebar__ul">
            @for (n of notifications(); track n.id) {
              @let actor = getUserById(n.actorId);
              <li class="notifications-sidebar__item">
                <button
                  type="button"
                  class="notifications-sidebar__row"
                  [class.notifications-sidebar__row--unread]="!n.read"
                  (click)="markAsRead(n.id)"
                >
                  @if (actor) {
                    <img
                      [src]="actor.avatarUrl"
                      [alt]="actor.displayName"
                      class="notifications-sidebar__avatar"
                      width="44"
                      height="44"
                    />
                    <div class="notifications-sidebar__content">
                      <span class="notifications-sidebar__text">
                        <span class="notifications-sidebar__username">{{ actor.username }}</span>
                        {{ n.text }}
                      </span>
                      <time class="notifications-sidebar__time" [attr.datetime]="n.timestamp">
                        {{ relativeTime(n.timestamp) }}
                      </time>
                    </div>
                    @if (!n.read) {
                      <span class="notifications-sidebar__dot" aria-hidden="true"></span>
                    }
                  }
                </button>
              </li>
            }
          </ul>
        }
      </section>
    </aside>
  </div>
}
```

---

### New in Phase 6: `src/app/features/notifications/notifications-sidebar.component.scss`

```scss
@use '../../../styles/variables' as *;

.notifications-sidebar {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
}

.notifications-sidebar__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.notifications-sidebar__panel {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: min(400px, 100vw - 48px);
  background: $bg-primary;
  border-right: 1px solid $border-primary;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  animation: notifications-sidebar-in 0.2s ease;
}

@keyframes notifications-sidebar-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.notifications-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-4 $space-4 $space-3;
  flex-shrink: 0;
}

.notifications-sidebar__title {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.notifications-sidebar__close {
  background: none;
  border: none;
  color: $text-primary;
  padding: $space-2;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: $bg-hover;
  }
}

.notifications-sidebar__mark-all-wrap {
  padding: 0 $space-4 $space-3;
  flex-shrink: 0;
}

.notifications-sidebar__mark-all {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $accent;
  background: none;
  border: none;
  cursor: pointer;
  padding: $space-2 $space-3;
  border-radius: 8px;

  &:hover {
    color: $accent-hover;
    background: $bg-hover;
  }
}

.notifications-sidebar__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 $space-4 $space-4;
}

.notifications-sidebar__ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notifications-sidebar__item {
  border-bottom: 1px solid $border-primary;

  &:last-child {
    border-bottom: none;
  }
}

.notifications-sidebar__row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-4;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  text-align: left;
  min-width: 0;

  &:hover {
    background: $bg-hover;
  }

  &--unread {
    background: $bg-tertiary;
  }
}

.notifications-sidebar__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.notifications-sidebar__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notifications-sidebar__text {
  font-size: $font-size-sm;
  color: $text-primary;
  line-height: 1.4;
}

.notifications-sidebar__username {
  font-weight: $font-weight-semibold;
  margin-right: 4px;
}

.notifications-sidebar__time {
  font-size: $font-size-xs;
  color: $text-muted;
}

.notifications-sidebar__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $accent;
  flex-shrink: 0;
}

.notifications-sidebar__empty {
  margin: 0;
  padding: $space-10 $space-6;
  font-size: $font-size-sm;
  color: $text-muted;
  text-align: center;
}
```

---

### Updated in Phase 6: `src/app/layout/left-sidebar/left-sidebar.component.ts` (complete)

```ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SearchSidebarService } from '../../core/search-sidebar.service';
import { NotificationsSidebarService } from '../../core/notifications-sidebar.service';
import {
  Home,
  Clapperboard,
  MessageCircle,
  Search,
  Compass,
  Heart,
  SquarePlus,
  User,
  Camera,
} from '../../core/icons';

interface NavItem {
  label: string;
  path: string;
  icon: typeof Home;
}

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss',
})
export class LeftSidebarComponent {
  readonly Camera = Camera;
  private searchSidebar = inject(SearchSidebarService);
  private notificationsSidebar = inject(NotificationsSidebarService);

  navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Reels', path: '/reels', icon: Clapperboard },
    { label: 'Messages', path: '/messages', icon: MessageCircle },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Notifications', path: '/notifications', icon: Heart },
    { label: 'Create', path: '/create', icon: SquarePlus },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  onNavClick(event: Event, item: NavItem): void {
    if (item.path === '/search') {
      event.preventDefault();
      this.searchSidebar.open();
    } else if (item.path === '/notifications') {
      event.preventDefault();
      this.notificationsSidebar.open();
    }
  }
}
```

---

### Updated in Phase 6: `src/app/layout/left-sidebar/left-sidebar.component.html` (complete)

```html
<div class="sidebar">
  <a routerLink="/" class="sidebar__logo" aria-label="Instagram home">
    <lucide-icon [img]="Camera" class="sidebar__logo-icon" [size]="24" aria-hidden="true"></lucide-icon>
    <span class="sidebar__logo-text">Instagram</span>
  </a>
  <nav class="sidebar__nav">
    @for (item of navItems; track item.path) {
      <a
        [routerLink]="item.path"
        routerLinkActive="sidebar__link--active"
        [routerLinkActiveOptions]="{ exact: item.path === '/' }"
        class="sidebar__link"
        (click)="onNavClick($event, item)"
      >
        <lucide-icon [img]="item.icon" class="sidebar__icon" [size]="24"></lucide-icon>
        <span class="sidebar__label">{{ item.label }}</span>
      </a>
    }
  </nav>
</div>
```

---

### Updated in Phase 6: `src/app/layout/main-layout/main-layout.component.ts` (complete)

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
export class MainLayoutComponent {}
```

---

### Updated in Phase 6: `src/app/layout/main-layout/main-layout.component.html` (complete)

```html
<div class="layout">
  <aside class="layout__left">
    <app-left-sidebar />
  </aside>
  <main class="layout__center">
    <router-outlet />
  </main>
  <aside class="layout__right">
    <app-right-sidebar />
  </aside>
  <app-search-sidebar />
  <app-notifications-sidebar />
</div>
```

---

### Updated in Phase 6: `src/app/app.routes.ts` (complete)

```ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'search', redirectTo: '', pathMatch: 'full' },
      { path: 'notifications', redirectTo: '', pathMatch: 'full' },
      { path: 'explore', component: PlaceholderComponent, data: { pageName: 'Explore' } },
      { path: 'reels', component: PlaceholderComponent, data: { pageName: 'Reels' } },
      { path: 'messages', component: PlaceholderComponent, data: { pageName: 'Messages' } },
      { path: 'create', component: PlaceholderComponent, data: { pageName: 'Create' } },
      { path: 'profile', component: PlaceholderComponent, data: { pageName: 'Profile' } },
    ],
  },
  { path: '**', redirectTo: '' },
];
```

---

### Updated in Phase 6: `src/app/core/icons.ts` – add CheckCheck

Add **CheckCheck** to the exports and to **ICONS_IN_USE**:

```ts
// In the export block, add:
CheckCheck,

// In ICONS_IN_USE array, add:
'CheckCheck',
```

---

## 9. How to Run and What to See

- Click **Notifications** in the left nav – the **notifications sidebar** opens from the left (feed stays visible behind the backdrop).
- You see "Notifications" title, close X, and "Mark all as read" when there are unread items. List shows avatar, "**username** liked your post." / "**username** started following you.", and relative time. Unread rows have a blue dot and slightly different background.
- Click a row – it becomes read (dot disappears). Click "Mark all as read" – all become read and the button hides.
- Close via the header X or by clicking the backdrop. Empty state: "No notifications yet." if the list is empty.

---

## 10. What’s Next (Phase 7)

Phase 7 could add **Direct Messages** (conversation list and chat UI). Define in PHASE-7.md when ready.

---

*This file describes Phase 6: notifications as a sidebar overlay and mark-as-read.*
