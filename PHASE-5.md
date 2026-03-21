# Phase 5 – Search (Sidebar)

> Sync note (2026-03-21): Added current cumulative snapshots for shared files that changed in later phases.

This document describes **Phase 5**: **Search** as a **sidebar overlay** (not a full page).

---

## What is Phase 5?

**Phase 5 adds Search as a sidebar** that opens over the main content:

1. **Open search** – Clicking **Search** in the left nav opens a **sidebar panel** from the left (does not navigate to a full page). The route `/search` redirects to home.
2. **Sidebar panel** – Title “Search”, close (X) button, search input with Search icon and clear (x) when typed, then either **Recent** or **Accounts** (results).
3. **Recent** – When the query is empty: “Recent” section with “Clear all” and a list of recently searched/viewed users (avatar, username, display name, X to remove). Empty state: “Search for users by username or name.”
4. **Results** – When the user types: filtered users (avatar, username, display name, Follow). Clicking a result adds that user to Recent. Current user is excluded. Data from `assets/data/users.ts`.
5. **Close** – Backdrop click or X closes the sidebar.

---

## 1. SearchSidebarService

- **`src/app/core/search-sidebar.service.ts`** (providedIn: 'root'):
  - **isOpen** – Readonly signal; **open()**, **close()**, **toggle()**.
  - **recentUserIds** – Writable signal (string[]); **recentUsers** – computed (User[] from ids).
  - **addRecent(userId)**, **removeRecent(userId)**, **clearRecent()** (max 20 recent).

---

## 2. Search Sidebar Component

- **SearchSidebarComponent** at `src/app/features/search/search-sidebar.component.*`:
  - Renders only when **SearchSidebarService.isOpen()** is true: backdrop + panel (slide-in from left).
  - Panel: header (“Search” + close X), input (Search icon, clear x when query has value), body (Recent with Clear all + list, or Accounts results when query is set).
  - **query** signal, **filteredUsers** computed (same as before). **recentUsers** from service (computed). Clicking a result calls **addRecent(user.id)**.
- **Main layout** includes `<app-search-sidebar />` so the overlay is available on every page.

---

## 3. Left Sidebar

- **Search** nav item: **(click)="onNavClick($event, item)"** – when `item.path === '/search'` we **preventDefault()** and call **SearchSidebarService.open()** so the search sidebar opens instead of navigating.

---

## 4. Routing

- **`/search`** – **redirectTo: ''** (pathMatch: 'full') so there is no full-page search route.

---

## 5. Folder Structure After Phase 5

```
src/app/
├── core/
│   ├── search-sidebar.service.ts   (new)
│   ├── icons.ts
│   ├── svgs.ts                     (custom SVG registry)
│   └── story-viewer.service.ts
├── features/
│   └── search/
│       ├── search-sidebar.component.ts   (sidebar overlay)
│       ├── search-sidebar.component.html
│       ├── search-sidebar.component.scss
│       ├── search.component.ts            (legacy full-page, unused by route)
│       ├── search.component.html
│       └── search.component.scss
└── layout/
    └── main-layout/   (includes app-search-sidebar)
```

---

## 5. Rules We Follow

| Rule              | Phase 5 usage |
|-------------------|----------------|
| **HTML = structure** | Search header, input, results list; no inline styles. |
| **SCSS = styling**   | Search layout, input, list rows; theme variables. |
| **TS = logic**       | Data from assets (users), query signal, filteredUsers computed. |
| **Data in assets**   | `users` from `assets/data`. |
| **Icons**            | Search, X from `src/app/core/icons.ts`. No inline SVG. |
| **SVGs**             | Custom SVGs (if needed) go in `src/app/core/svgs.ts`. |

---

## 6. Complete Code for Phase 5 (Copy Exactly)

---

### New in Phase 5: `src/app/core/search-sidebar.service.ts`

```ts
import { Injectable, signal, computed } from '@angular/core';
import { users } from '../../assets/data/users';
import type { User } from '../../assets/data';

@Injectable({ providedIn: 'root' })
export class SearchSidebarService {
  private readonly _isOpen = signal(false);
  private readonly _recentUserIds = signal<string[]>([]);

  readonly isOpen = this._isOpen.asReadonly();
  readonly recentUserIds = this._recentUserIds.asReadonly();

  readonly recentUsers = computed(() => {
    const ids = this._recentUserIds();
    return ids
      .map((id) => users.find((u) => u.id === id))
      .filter((u): u is User => u != null);
  });

  open(): void {
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  toggle(): void {
    this._isOpen.update((v) => !v);
  }

  addRecent(userId: string): void {
    this._recentUserIds.update((ids) => {
      const next = ids.filter((id) => id !== userId);
      next.unshift(userId);
      return next.slice(0, 20);
    });
  }

  removeRecent(userId: string): void {
    this._recentUserIds.update((ids) => ids.filter((id) => id !== userId));
  }

  clearRecent(): void {
    this._recentUserIds.set([]);
  }
}
```

---

### New in Phase 5: `src/app/features/search/search-sidebar.component.ts`

```ts
import { Component, signal, computed, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Search as SearchIcon, X } from '../../core/icons';
import { SearchSidebarService } from '../../core/search-sidebar.service';
import { users } from '../../../assets/data/users';

const CURRENT_USER_ID = 'u5';

@Component({
  selector: 'app-search-sidebar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './search-sidebar.component.html',
  styleUrl: './search-sidebar.component.scss',
})
export class SearchSidebarComponent {
  readonly SearchIcon = SearchIcon;
  readonly X = X;

  private searchSidebar = inject(SearchSidebarService);

  query = signal('');

  private searchableUsers = users.filter((u) => u.id !== CURRENT_USER_ID);

  filteredUsers = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    return this.searchableUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q)
    );
  });

  get isOpen(): boolean {
    return this.searchSidebar.isOpen();
  }

  recentUsers = this.searchSidebar.recentUsers;

  close(): void {
    this.searchSidebar.close();
  }

  clearQuery(): void {
    this.query.set('');
  }

  addRecent(userId: string): void {
    this.searchSidebar.addRecent(userId);
  }

  removeRecent(userId: string, e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.searchSidebar.removeRecent(userId);
  }

  clearRecent(): void {
    this.searchSidebar.clearRecent();
  }
}
```

---

### New in Phase 5: `src/app/features/search/search-sidebar.component.html`

```html
@if (isOpen) {
  <div class="search-sidebar">
    <div class="search-sidebar__backdrop" (click)="close()" aria-hidden="true"></div>
    <aside class="search-sidebar__panel" role="dialog" aria-modal="true" aria-label="Search">
      <header class="search-sidebar__header">
        <h2 class="search-sidebar__title">Search</h2>
        <button type="button" class="search-sidebar__close" aria-label="Close" (click)="close()">
          <lucide-icon [img]="X" [size]="24"></lucide-icon>
        </button>
      </header>

      <div class="search-sidebar__input-wrap">
        <lucide-icon [img]="SearchIcon" class="search-sidebar__input-icon" [size]="20"></lucide-icon>
        <input
          type="search"
          class="search-sidebar__input"
          placeholder="Search"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
          aria-label="Search users"
        />
        @if (query()) {
          <button type="button" class="search-sidebar__clear" aria-label="Clear" (click)="clearQuery()">
            <lucide-icon [img]="X" [size]="16"></lucide-icon>
          </button>
        }
      </div>

      <section class="search-sidebar__body">
        @if (query().trim()) {
          @if (filteredUsers().length > 0) {
            <p class="search-sidebar__label">Accounts</p>
            <ul class="search-sidebar__list">
              @for (user of filteredUsers(); track user.id) {
                <li class="search-sidebar__item">
                  <button type="button" class="search-sidebar__item-btn" (click)="addRecent(user.id)">
                    <img [src]="user.avatarUrl" [alt]="user.displayName" class="search-sidebar__avatar" width="44" height="44" />
                    <div class="search-sidebar__info">
                      <span class="search-sidebar__username">{{ user.username }}</span>
                      <span class="search-sidebar__name">{{ user.displayName }}</span>
                    </div>
                  </button>
                  <button type="button" class="search-sidebar__follow">Follow</button>
                </li>
              }
            </ul>
          } @else {
            <p class="search-sidebar__empty">No accounts found.</p>
          }
        } @else {
          <div class="search-sidebar__recent">
            <div class="search-sidebar__recent-header">
              <span class="search-sidebar__label">Recent</span>
              @if (recentUsers().length > 0) {
                <button type="button" class="search-sidebar__clear-all" (click)="clearRecent()">Clear all</button>
              }
            </div>
            @if (recentUsers().length > 0) {
              <ul class="search-sidebar__list">
                @for (user of recentUsers(); track user.id) {
                  <li class="search-sidebar__item">
                    <button type="button" class="search-sidebar__item-btn">
                      <img [src]="user.avatarUrl" [alt]="user.displayName" class="search-sidebar__avatar" width="44" height="44" />
                      <div class="search-sidebar__info">
                        <span class="search-sidebar__username">{{ user.username }}</span>
                        <span class="search-sidebar__name">{{ user.displayName }}</span>
                      </div>
                    </button>
                    <button type="button" class="search-sidebar__remove" aria-label="Remove from recent" (click)="removeRecent(user.id, $event)">
                      <lucide-icon [img]="X" [size]="16"></lucide-icon>
                    </button>
                  </li>
                }
              </ul>
            } @else {
              <p class="search-sidebar__hint">Search for users by username or name.</p>
            }
          </div>
        }
      </section>
    </aside>
  </div>
}
```

---

### New in Phase 5: `src/app/features/search/search-sidebar.component.scss`

```scss
@use '../../../styles/variables' as *;

.search-sidebar {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
}

.search-sidebar__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.search-sidebar__panel {
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
  animation: search-sidebar-in 0.2s ease;
}

@keyframes search-sidebar-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.search-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-4 $space-4 $space-3;
  flex-shrink: 0;
}

.search-sidebar__title {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.search-sidebar__close {
  background: none;
  border: none;
  color: $text-primary;
  padding: $space-2;
  cursor: pointer;
  border-radius: 4px;
  &:hover { background: $bg-hover; }
}

.search-sidebar__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 $space-4 $space-4;
  flex-shrink: 0;
}

.search-sidebar__input-icon {
  position: absolute;
  left: $space-4 + 12px;
  color: $text-muted;
  pointer-events: none;
}

.search-sidebar__input {
  width: 100%;
  padding: $space-3 $space-10 $space-3 $space-10;
  font-size: $font-size-sm;
  color: $text-primary;
  background: $bg-secondary;
  border: 1px solid $border-primary;
  border-radius: 8px;
  outline: none;
  &::placeholder { color: $text-muted; }
  &:focus { border-color: $border-secondary; }
}

.search-sidebar__clear {
  position: absolute;
  right: $space-4 + 8px;
  background: none;
  border: none;
  color: $text-muted;
  padding: $space-1;
  cursor: pointer;
  border-radius: 4px;
  &:hover { color: $text-primary; }
}

.search-sidebar__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 $space-4 $space-4;
}

.search-sidebar__recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-3;
}

.search-sidebar__label {
  margin: 0;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
}

.search-sidebar__clear-all {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $accent;
  background: none;
  border: none;
  cursor: pointer;
  &:hover { color: $accent-hover; }
}

.search-sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-sidebar__item {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 0;
  border-bottom: 1px solid $border-primary;
  &:last-child { border-bottom: none; }
}

.search-sidebar__item-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $space-4;
  min-width: 0;
  padding: $space-2 0;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  text-align: left;
  &:hover { opacity: 0.9; }
}

.search-sidebar__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.search-sidebar__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-sidebar__username {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.search-sidebar__name {
  font-size: $font-size-xs;
  color: $text-muted;
}

.search-sidebar__follow {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $accent;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  &:hover { color: $accent-hover; }
}

.search-sidebar__remove {
  background: none;
  border: none;
  color: $text-muted;
  padding: $space-2;
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
  &:hover { color: $text-primary; background: $bg-hover; }
}

.search-sidebar__empty,
.search-sidebar__hint {
  margin: 0;
  font-size: $font-size-sm;
  color: $text-muted;
}

.search-sidebar__recent .search-sidebar__label {
  margin-bottom: 0;
}
```

---

### Updated in Phase 5: `src/app/layout/left-sidebar/left-sidebar.component.ts` (complete)

```ts
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SearchSidebarService } from '../../core/search-sidebar.service';
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
    }
  }
}
```

---

### Updated in Phase 5: `src/app/layout/left-sidebar/left-sidebar.component.html` (complete)

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

### Updated in Phase 5: `src/app/layout/main-layout/main-layout.component.ts` (complete)

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { SearchSidebarComponent } from '../../features/search/search-sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    LeftSidebarComponent,
    RightSidebarComponent,
    RouterOutlet,
    SearchSidebarComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
```

---

### Updated in Phase 5: `src/app/layout/main-layout/main-layout.component.html` (complete)

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

### Updated in Phase 5: `src/app/app.routes.ts` (complete)

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

## 7. How to Run and What to See

- Click **Search** in the left nav – the **search sidebar** opens from the left (feed stays visible behind the backdrop).
- You see “Search” title, close X, and search input. When the input is empty: “Recent” and “Clear all” (if any recent) or “Search for users by username or name.”
- Type (e.g. “angular”, “teacher”) – “Accounts” list appears; click a user to add them to Recent.
- Use the small x in the input to clear the query; use X on a recent row to remove it; “Clear all” clears recent.
- Close via the header X or by clicking the backdrop.

---

## 6. What’s Next (Phase 6)

Phase 6 could add **direct messages** (messages list and chat UI) or **notifications** (notification list and mark-as-read). Define in PHASE-6.md when ready.

---

*This file describes Phase 5: search as a sidebar overlay and recent list.*
