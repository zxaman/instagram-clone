# Phase 2 – Layout Shell (What We Did & Why)

This document explains **everything we did in Phase 2** in simple terms so you can make videos from it. Each section can become a video or part of a video.

---

## What is Phase 2?

**Phase 2 is the layout shell** that matches the **current Instagram web UI** (dark mode). We did not build stories or feed yet. We:

1. Built a **main layout** with three areas: left sidebar, center, right sidebar.
2. Added a **left sidebar** that shows **only icons by default**; when you **hover** over it, it expands and shows the “Instagram” logo text and full labels (Home, Reels, Messages, etc.). Nav order matches Instagram: **Home → Reels → Messages → Search → Explore → Notifications → Create → Profile**.
3. Added a **right sidebar** with the current user card + **“Switch”** link, **“Suggested for you”** with a **real list** from assets (avatar, username, reason, Follow button), and **no lines between list items** – only vertical spacing. Plus footer links and copyright.
4. Wired **routing** so the layout wraps every page and each nav link goes to a route (home or a “coming soon” placeholder).
5. Made the layout **responsive**: right sidebar hides on smaller screens; on mobile the left sidebar stays icon-only (no hover expand).

**Why?** So the app looks and behaves like Instagram’s web layout: narrow icon bar that expands on hover, clean suggestions list with no dividers, and a clear place for feed (center), nav (left), and suggestions (right).

---

## 1. Main Layout Component (The Three-Column Shell)

### What we did

We created a **main layout** that divides the screen into three parts and puts the **router outlet** in the center. The left sidebar is **narrow (72px) by default** and **expands to 244px on hover**. There is **no vertical border** between the center and the right sidebar so the right panel has a clean edge.

### Files we created

#### `src/app/layout/main-layout/main-layout.component.ts`

- **What it is:** The main layout **component** (logic only).
- **What’s inside:** A standalone component that imports `RouterOutlet`, `LeftSidebarComponent`, and `RightSidebarComponent`. No extra logic; it only composes the three pieces.

#### `src/app/layout/main-layout/main-layout.component.html`

- **What it is:** The **structure** of the layout.
- **What’s inside:** A wrapper `div` with class `layout`; left `<aside>` with `<app-left-sidebar />`; center `<main>` with `<router-outlet />`; right `<aside>` with `<app-right-sidebar />`. HTML = structure only.

#### `src/app/layout/main-layout/main-layout.component.scss`

- **What it is:** The **styles** for the layout.
- **What we did:**
  - **Left column:** Fixed, width `$sidebar-width-collapsed` (72px) by default, **transition** for smooth expand. On **`:hover`** width becomes `$sidebar-width` (244px). So by default you see only icons; when you hover the left bar it widens and overlays the center slightly.
  - **Center column:** `flex: 1`, margins so it sits between the two sidebars. **No border-right** – no line between center and right sidebar.
  - **Right column:** Fixed, full height, fixed width.
- **Responsive:**
  - Below 1260px: right sidebar hidden; center uses full width on the right.
  - Below 768px: left sidebar stays 72px; **hover does not expand** (so on mobile it’s always icon-only).

We added **`$sidebar-width-collapsed: 72px`** in `_variables.scss` for the narrow state.

### Simple explanation for your video

- **Layout** = the frame. Only the center content (router outlet) changes when you navigate.
- **Left sidebar hover** = pure CSS: `width: 72px` → `:hover { width: 244px }`. No JavaScript. The expanded part overlays the center so we don’t shift the whole page.
- **No line between center and right** = we don’t use a border on the center column so the right panel looks clean like the reference.

---

## 2. Left Sidebar (Icon-Only by Default, Full Labels on Hover)

### What we did

We built the left sidebar to match **current Instagram web UI**:

- **Default (not hovered):** Only **icons** are visible. The sidebar is narrow (72px). Logo is an **Instagram-style icon** (camera in rounded square); no “Instagram” text. Nav items show only icons – no “Home”, “Reels”, etc. text.
- **On hover:** When you hover over the **left column**, the sidebar expands (handled by the layout). Inside the sidebar we **show the labels**: “Instagram” text next to the logo, and “Home”, “Reels”, “Messages”, etc. next to each icon.
- **Nav order** (same as Instagram): **Home → Reels → Messages → Search → Explore → Notifications → Create → Profile**.
- **Active state:** The current page is highlighted with `routerLinkActive`.

### Files we created

#### `src/app/layout/left-sidebar/left-sidebar.component.ts`

- **What it is:** The **logic** for the left sidebar.
- **What’s inside:** An array `navItems` with `label`, `path`, and `icon`, in the order above. No styling; only data for the nav links.

#### `src/app/layout/left-sidebar/left-sidebar.component.html`

- **What it is:** The **structure** of the sidebar.
- **What’s inside:**
  - **Logo:** An Instagram-style **camera icon** (SVG) that is always visible, and a **“Instagram”** text span that we show/hide with CSS (visible only when the left column is hovered).
  - A `<nav>` with a link for each `navItems` entry. Each link has an **icon** (SVG) and a **label** span. The label is hidden by default and shown on hover.
  - Each link uses `routerLink`, `routerLinkActive`, and `routerLinkActiveOptions` so “Home” is active only on `/`.
  - **Icons** use **Lucide** and are imported from the central **`src/app/core/icons.ts`** file: Camera (logo), Home, Clapperboard, MessageCircle, Search, Compass, Heart, SquarePlus, User. Component imports `LucideAngularModule` from `lucide-angular` and icon symbols from `../../core/icons`; template uses `[img]="Icon"`.

#### `src/app/layout/left-sidebar/left-sidebar.component.scss`

- **What it is:** The **styles** for the left sidebar.
- **What we did:**
  - **Logo and labels:** By default we hide the “Instagram” text and all nav labels with `opacity: 0` and `width: 0` (and optional `overflow: hidden`). They get a short **transition** so they fade in when shown.
  - **Show on hover:** We use **`:host-context(.layout__left:hover)`** so when the **parent** left column is hovered, we set `.sidebar__logo-text` and `.sidebar__label` to `opacity: 1` and `width: auto`. So the labels appear only when the user hovers the left bar – no JavaScript.
  - Link and logo layout: flex, gap, padding, hover background. Active link is bolder.
  - **Mobile (768px):** Labels and logo text stay hidden (no hover expand); we only show icons, centered.

### Simple explanation for your video

- **Icon-only by default** = current Instagram behavior. We keep the sidebar narrow and only show icons until the user hovers.
- **`:host-context(.layout__left:hover)`** = Angular’s way to react to a **parent** being hovered. The sidebar component doesn’t need to know the layout width; it just shows or hides labels based on parent hover.
- **Nav order** = we match Instagram’s order (Home, Reels, Messages, Search, Explore, Notifications, Create, Profile) so it feels familiar.

---

## 3. Right Sidebar (User Card, “Suggested for you” List, Footer)

### What we did

We built the right sidebar to match the reference:

- **User card:** Avatar, username, display name. On the right we added a **“Switch”** link (blue, like Instagram). Data comes from `assets/data/users.ts` (e.g. the “You” user).
- **“Suggested for you”** (not “Suggestions for you”): Header with “Suggested for you” on the left and “See all” on the right.
- **Suggestions list:** A **real list** from `assets/data/suggestions.ts` and `assets/data/users.ts`. Each row has: small **avatar**, **username**, **reason** (e.g. “Followed by …” or “Suggested for you”), and a **“Follow”** button. **No horizontal or vertical lines between items** – only vertical spacing (padding) so the background is uniform like the reference.
- **Footer:** Links (About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified) and **© 2026 INSTAGRAM FROM META**.

### Files we created

#### `src/app/layout/right-sidebar/right-sidebar.component.ts`

- **What it is:** The **logic** for the right sidebar.
- **What’s inside:** We import `users` and `suggestions` from assets. `currentUser` is e.g. `users[4]`. We expose `suggestionsList` and a helper `getUserById(id)` so the template can show each suggestion with the correct user (avatar, username). No styling; only data and a small lookup.

#### `src/app/layout/right-sidebar/right-sidebar.component.html`

- **What it is:** The **structure** of the right sidebar.
- **What’s inside:**
  - User card: avatar, username, display name, and a “Switch” link.
  - Suggestions section: header (“Suggested for you” + “See all”), then a **list** (`suggestions-list`) with `@for (item of suggestionsList)`. For each item we get the user with `getUserById(item.userId)` and show avatar, username, reason, and a “Follow” button.
  - Footer: wrapped links with dots, then copyright.

No styles in HTML; only structure and bindings.

#### `src/app/layout/right-sidebar/right-sidebar.component.scss`

- **What it is:** The **styles** for the right sidebar.
- **What we did:**
  - User card: flex row, avatar (56px circle), text truncated, “Switch” link in accent color.
  - **Suggestions list:** `.suggestions-list` has **no borders** and **no divider lines**. `.suggestions-list__item` has only **padding** (e.g. `padding: $space-3 0`) for vertical spacing – no `border-top`, `border-bottom`, or `hr`. So the list looks clean with a uniform background, like the reference.
  - Each row: avatar (32px), username (bold), reason (muted), “Follow” button (accent).
  - Footer: small text, muted color, wrap links with dots.

### Simple explanation for your video

- **Data from assets** = we use `suggestions` and `users` from Phase 1. The right sidebar only displays and links; no hard-coded list.
- **No lines between items** = we deliberately avoid any border or divider in the suggestions list. Only padding separates rows so it matches the “no horizontal dividing lines” look from the reference.
- **“Suggested for you”** = we use that exact heading (and “See all”) to match current Instagram wording.

---

## 4. Routing: Layout as Parent, Pages as Children

### What we did

- **One parent route** uses `MainLayoutComponent`. The layout (left + center + right) is always visible.
- **Child routes** define what appears in the **center**: Home, Search, Explore, Reels, Messages, Notifications, Create, Profile.
- Home shows `HomeComponent`; the others show `PlaceholderComponent` with route **data** `{ pageName: 'Search' }`, etc., so one placeholder component shows different titles.

### Files we created/updated

- **`src/app/features/placeholder/`** – Placeholder component that reads `pageName` from route data.
- **`src/app/app.routes.ts`** – Parent route with `MainLayoutComponent` and children for `''`, `search`, `explore`, `reels`, `messages`, `notifications`, `create`, `profile`; catch-all `**` redirects to `''`.

### Simple explanation for your video

- **Parent and child routes** = layout is the parent; the center content is the child in the router outlet.
- **Route data** = we pass `pageName` in the route and read it in the component so we don’t create a separate component for each nav item.

---

## 5. Responsive Behavior

### What we did

All behavior is in **SCSS** (no TypeScript for layout):

- **Desktop:** Left sidebar 72px by default, 244px on hover. Center and right sidebar as described.
- **Medium (&lt; 1260px):** Right sidebar hidden; center extends to the right.
- **Mobile (&lt; 768px):** Left sidebar stays 72px; **hover does not expand** (we set `&:hover { width: $sidebar-width-collapsed }` so it stays icon-only). Labels stay hidden.

### Simple explanation for your video

- **Responsive** = one layout, different behavior at different widths. We use media queries and the same variables.
- **No JS for layout** = widths and hover behavior are all in SCSS.

---

## 6. Folder Structure After Phase 2

```
src/app/
├── app.html, app.ts, app.scss
├── app.routes.ts
├── layout/
│   ├── main-layout/
│   │   ├── main-layout.component.ts
│   │   ├── main-layout.component.html
│   │   └── main-layout.component.scss
│   ├── left-sidebar/
│   │   ├── left-sidebar.component.ts
│   │   ├── left-sidebar.component.html
│   │   └── left-sidebar.component.scss
│   └── right-sidebar/
│       ├── right-sidebar.component.ts
│       ├── right-sidebar.component.html
│       └── right-sidebar.component.scss
└── features/
    ├── home/
    │   └── ... (Phase 1)
    └── placeholder/
        ├── placeholder.component.ts
        ├── placeholder.component.html
        └── placeholder.component.scss
```

Layout under `layout/`; page content under `features/`. Same rules: HTML = structure, SCSS = style, TS = logic; data from assets.

---

## 7. Complete Code for Phase 2 (Copy Exactly)

**Important:** For any file that already existed in Phase 1 and was **updated** in Phase 2 (e.g. `app.routes.ts`, `src/styles/_variables.scss`), the code below is the **complete file** after Phase 2. Replace your Phase 1 version with this so you have Phase 1 + Phase 2 in one file. For files that are **new** in Phase 2, create them and paste the code.

---

### Files updated in Phase 2 (replace your Phase 1 version with this)

#### `src/app/app.routes.ts` (complete: Phase 1 + Phase 2)

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
      { path: 'search', component: PlaceholderComponent, data: { pageName: 'Search' } },
      { path: 'explore', component: PlaceholderComponent, data: { pageName: 'Explore' } },
      { path: 'reels', component: PlaceholderComponent, data: { pageName: 'Reels' } },
      { path: 'messages', component: PlaceholderComponent, data: { pageName: 'Messages' } },
      { path: 'notifications', component: PlaceholderComponent, data: { pageName: 'Notifications' } },
      { path: 'create', component: PlaceholderComponent, data: { pageName: 'Create' } },
      { path: 'profile', component: PlaceholderComponent, data: { pageName: 'Profile' } },
    ],
  },
  { path: '**', redirectTo: '' },
];
```

---

#### `src/styles/_variables.scss` (complete: Phase 1 + Phase 2 – added `$sidebar-width-collapsed`)

```scss
// ============================================
// Instagram-style dark theme
// Use in component SCSS only; keep TS free of styling
// ============================================

// Backgrounds
$bg-primary: #000000;
$bg-secondary: #121212;
$bg-tertiary: #1a1a1a;
$bg-elevated: #262626;
$bg-hover: #2a2a2a;

// Text
$text-primary: #f5f5f5;
$text-secondary: #a8a8a8;
$text-muted: #737373;

// Borders
$border-primary: #262626;
$border-secondary: #363636;

// Accent (Instagram blue)
$accent: #0095f6;
$accent-hover: #1877f2;
$accent-secondary: #3797f0;

// States
$error: #ed4956;
$success: #00c853;
$warning: #ffab00;

// Story ring gradient (Instagram-like)
$story-ring-gradient: linear-gradient(
  45deg,
  #f09433,
  #e6683c,
  #dc2743,
  #cc2366,
  #bc1888
);

// Spacing scale
$space-1: 4px;
$space-2: 8px;
$space-3: 12px;
$space-4: 16px;
$space-5: 20px;
$space-6: 24px;
$space-8: 32px;
$space-10: 40px;

// Typography
$font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
  Arial, sans-serif;
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Layout
$header-height: 60px;
$sidebar-width: 244px;
$sidebar-width-collapsed: 72px;
$feed-max-width: 470px;
$right-sidebar-width: 320px;
```

---

### New files in Phase 2 (create and paste)

#### `src/app/layout/main-layout/main-layout.component.ts`

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [LeftSidebarComponent, RightSidebarComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
```

---

#### `src/app/layout/main-layout/main-layout.component.html`

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
</div>
```

---

#### `src/app/layout/main-layout/main-layout.component.scss`

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;

.layout {
  display: flex;
  min-height: 100vh;
  max-width: 100%;

  &__left {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: $sidebar-width-collapsed;
    display: flex;
    flex-direction: column;
    border-right: 1px solid $border-primary;
    background-color: $bg-primary;
    padding: $space-4 $space-2;
    z-index: 10;
    transition: width 0.2s ease;

    &:hover {
      width: $sidebar-width;
    }
  }

  &__center {
    flex: 1;
    min-width: 0;
    margin-left: $sidebar-width-collapsed;
    margin-right: $right-sidebar-width;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: $bg-primary;
  }

  &__right {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: $right-sidebar-width;
    background-color: $bg-primary;
    padding: $space-6 $space-4;
    z-index: 10;
    overflow-y: auto;
  }
}

@media (max-width: 1260px) {
  .layout {
    &__right {
      display: none;
    }

    &__center {
      margin-right: 0;
    }
  }
}

@media (max-width: 768px) {
  .layout {
    &__left {
      width: $sidebar-width-collapsed;
      padding: $space-4 $space-2;

      &:hover {
        width: $sidebar-width-collapsed;
      }
    }

    &__center {
      margin-left: $sidebar-width-collapsed;
    }
  }
}
```

---

#### `src/app/layout/left-sidebar/left-sidebar.component.ts`

```ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss',
})
export class LeftSidebarComponent {
  navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Reels', path: '/reels', icon: 'reels' },
    { label: 'Messages', path: '/messages', icon: 'messages' },
    { label: 'Search', path: '/search', icon: 'search' },
    { label: 'Explore', path: '/explore', icon: 'explore' },
    { label: 'Notifications', path: '/notifications', icon: 'notifications' },
    { label: 'Create', path: '/create', icon: 'create' },
    { label: 'Profile', path: '/profile', icon: 'profile' },
  ];
}
```

---

#### `src/app/layout/left-sidebar/left-sidebar.component.html`

```html
<div class="sidebar">
  <a routerLink="/" class="sidebar__logo" aria-label="Instagram home">
    <span class="sidebar__logo-icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    </span>
    <span class="sidebar__logo-text">Instagram</span>
  </a>
  <nav class="sidebar__nav">
    @for (item of navItems; track item.path) {
      <a
        [routerLink]="item.path"
        routerLinkActive="sidebar__link--active"
        [routerLinkActiveOptions]="{ exact: item.path === '/' }"
        class="sidebar__link"
      >
        <span class="sidebar__icon" [attr.data-icon]="item.icon">
          @switch (item.icon) {
            @case ('home') {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            }
            @case ('reels') {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            }
            @case ('messages') {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            }
            @case ('search') {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            }
            @case ('explore') {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            }
            @case ('notifications') {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            }
            @case ('create') {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            }
            @case ('profile') {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            }
            @default {}
          }
        </span>
        <span class="sidebar__label">{{ item.label }}</span>
      </a>
    }
  </nav>
</div>
```

---

#### `src/app/layout/left-sidebar/left-sidebar.component.scss`

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;

.sidebar {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  height: 100%;
  padding: $space-2 0;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-3 $space-2;
  margin-bottom: $space-2;
  border-radius: 8px;
  color: $text-primary;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: $bg-hover;
  }
}

.sidebar__logo-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    width: 24px;
    height: 24px;
    stroke: $text-primary;
  }
}

.sidebar__logo-text {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  letter-spacing: -0.5px;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  width: 0;
  transition: opacity 0.2s ease, width 0.2s ease;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.sidebar__link {
  @include flex-center;
  justify-content: flex-start;
  gap: $space-4;
  padding: $space-3 $space-2;
  border-radius: 8px;
  color: $text-primary;
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: $bg-hover;
  }
}

.sidebar__link--active {
  font-weight: $font-weight-semibold;
}

.sidebar__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    width: 24px;
    height: 24px;
    stroke: $text-primary;
    fill: none;
  }

  .sidebar__link--active & svg {
    stroke: $text-primary;
  }

  [data-icon='reels'] svg {
    fill: $text-primary;
    stroke: none;
  }
}

.sidebar__label {
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  width: 0;
  transition: opacity 0.2s ease, width 0.2s ease;
}

:host-context(.layout__left:hover) {
  .sidebar__logo-text,
  .sidebar__label {
    opacity: 1;
    width: auto;
  }
}

@media (max-width: 768px) {
  .sidebar__logo-text,
  .sidebar__label {
    display: none !important;
  }

  .sidebar__logo {
    justify-content: center;
  }

  .sidebar__link {
    justify-content: center;
    padding: $space-4;
  }
}
```

---

#### `src/app/layout/right-sidebar/right-sidebar.component.ts`

```ts
import { Component } from '@angular/core';
import { users } from '../../../assets/data/users';
import { suggestions } from '../../../assets/data/suggestions';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent {
  currentUser = users[4];
  suggestionsList = suggestions;

  getUserById(id: string) {
    return users.find((u) => u.id === id) ?? null;
  }
}
```

---

#### `src/app/layout/right-sidebar/right-sidebar.component.html`

```html
<div class="right-sidebar">
  <section class="right-sidebar__user">
    <div class="user-card">
      <img
        [src]="currentUser.avatarUrl"
        [alt]="currentUser.displayName"
        class="user-card__avatar"
        width="56"
        height="56"
      />
      <div class="user-card__info">
        <span class="user-card__username">{{ currentUser.username }}</span>
        <span class="user-card__name">{{ currentUser.displayName }}</span>
      </div>
      <a href="#" class="user-card__switch">Switch</a>
    </div>
  </section>
  <section class="right-sidebar__suggestions">
    <div class="right-sidebar__header">
      <span class="right-sidebar__title">Suggested for you</span>
      <a href="#" class="right-sidebar__action">See all</a>
    </div>
    <div class="suggestions-list">
      @for (item of suggestionsList; track item.userId) {
        @let user = getUserById(item.userId);
        @if (user) {
          <div class="suggestions-list__item">
            <img
              [src]="user.avatarUrl"
              [alt]="user.displayName"
              class="suggestions-list__avatar"
              width="32"
              height="32"
            />
            <div class="suggestions-list__info">
              <span class="suggestions-list__username">{{ user.username }}</span>
              <span class="suggestions-list__reason">{{ item.reason }}</span>
            </div>
            <button type="button" class="suggestions-list__follow">Follow</button>
          </div>
        }
      }
    </div>
  </section>
  <footer class="right-sidebar__footer">
    <div class="right-sidebar__links">
      <a href="#">About</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">Help</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">Press</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">API</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">Jobs</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">Privacy</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">Terms</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">Locations</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">Language</a>
      <span class="right-sidebar__dot">·</span>
      <a href="#">Meta Verified</a>
    </div>
    <p class="right-sidebar__copyright">© 2026 INSTAGRAM FROM META</p>
  </footer>
</div>
```

---

#### `src/app/layout/right-sidebar/right-sidebar.component.scss`

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;

.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: $space-6;
  height: 100%;
}

.right-sidebar__user {
  margin-bottom: $space-2;
}

.right-sidebar__header {
  @include flex-between;
  margin-bottom: $space-4;
}

.right-sidebar__title {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
}

.right-sidebar__action {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-primary;

  &:hover {
    color: $text-secondary;
  }
}

.right-sidebar__suggestions {
}

.right-sidebar__footer {
  margin-top: auto;
  padding-top: $space-6;
}

.right-sidebar__links {
  display: flex;
  flex-wrap: wrap;
  gap: $space-1 $space-2;
  margin-bottom: $space-3;
  font-size: $font-size-xs;
  color: $text-muted;

  a {
    color: $text-muted;

    &:hover {
      text-decoration: underline;
    }
  }
}

.right-sidebar__dot {
  color: $text-muted;
  user-select: none;
}

.right-sidebar__copyright {
  font-size: $font-size-xs;
  color: $text-muted;
  margin: 0;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.suggestions-list__item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 0;
  min-height: 48px;
}

.suggestions-list__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.suggestions-list__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  gap: 2px;
}

.suggestions-list__username {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  @include truncate;
}

.suggestions-list__reason {
  font-size: $font-size-xs;
  color: $text-muted;
  @include truncate;
}

.suggestions-list__follow {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $accent;
  flex-shrink: 0;

  &:hover {
    color: $accent-hover;
  }
}

.user-card {
  @include flex-center;
  justify-content: flex-start;
  gap: $space-3;
  padding: $space-2 0;
  border-radius: 8px;
  transition: background-color 0.15s ease;
}

.user-card__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-card__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.user-card__username {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  @include truncate;
}

.user-card__name {
  font-size: $font-size-xs;
  color: $text-muted;
  @include truncate;
}

.user-card__switch {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $accent;
  flex-shrink: 0;

  &:hover {
    color: $accent-hover;
  }
}
```

---

#### `src/app/features/placeholder/placeholder.component.ts`

```ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss',
})
export class PlaceholderComponent {
  pageName = 'Page';

  constructor(private route: ActivatedRoute) {
    this.pageName = this.route.snapshot.data['pageName'] ?? 'Page';
  }
}
```

---

#### `src/app/features/placeholder/placeholder.component.html`

```html
<div class="placeholder">
  <h1 class="placeholder__title">{{ pageName }}</h1>
  <p class="placeholder__text">This section will be built in a later phase.</p>
</div>
```

---

#### `src/app/features/placeholder/placeholder.component.scss`

```scss
@use '../../../styles/variables' as *;

.placeholder {
  width: 100%;
  max-width: 400px;
  padding: $space-10 $space-6;
  text-align: center;
}

.placeholder__title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 $space-3;
}

.placeholder__text {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin: 0;
}
```

---

## 8. Rules We Still Follow

| Rule | How we used it in Phase 2 |
|------|----------------------------|
| **HTML = structure only** | Layout and sidebars: divs, nav, links, SVG icons. No inline styles. |
| **SCSS = styling only** | Widths, colors, flexbox, hover, transitions, media queries in SCSS. Variables and mixins from `styles/`. |
| **TS = logic only** | Nav items array, current user and suggestions from assets, `getUserById`. No style or layout logic. |
| **Data in assets** | User and suggestions list come from `assets/data/users.ts` and `assets/data/suggestions.ts`. |

---

## 9. How to Run and What to See

```bash
cd instagram-clone
npm start
```

You should see:

- **Left:** Narrow bar with **only icons** (Instagram logo icon, Home, Reels, Messages, Search, Explore, Notifications, Create, Profile). **Hover over the left bar** – it expands and shows “Instagram” and all labels.
- **Center:** Home text by default; or placeholder (“Search”, “Explore”, etc.) when you click those links.
- **Right:** User card (avatar, username, display name, **Switch** link), **“Suggested for you”** with a **list** of suggestions (avatar, username, reason, Follow) with **no lines between rows**, then footer links and **© 2026 INSTAGRAM FROM META**.
- **Responsive:** Resize the window; right sidebar disappears on smaller width; on mobile the left bar stays icon-only (no expand on hover).

---

## 10. What You Can Teach in Phase 2 (Video Ideas)

1. **“Building the main layout (3 columns)”** – Layout component, router outlet, narrow left that expands on hover, no border between center and right.
2. **“Left sidebar: icon-only by default, labels on hover”** – Nav array, `routerLink` / `routerLinkActive`, inline SVG icons, and `:host-context(.layout__left:hover)` to show labels without JavaScript.
3. **“Right sidebar: user, Suggested for you list, footer”** – Data from assets, user card with Switch, suggestions list with **no lines between items** (only padding), footer links and copyright.
4. **“Parent and child routes”** – Layout as parent, child routes in the outlet, route data for placeholder titles.
5. **“Responsive layout with SCSS only”** – Media queries, hiding right sidebar, keeping left icon-only on mobile with no hover expand.

---

## 10. What’s Next (Phase 3)

Phase 3 will add the **Stories** section:

- Horizontal strip of story rings (avatar + username) in the center column.
- “Your story” first, then others from `assets/data/stories.ts`.
- Optional: story viewer (modal/overlay) when you click a story.

You can end Phase 2 by saying: “The shell matches current Instagram web UI; next we’ll add stories and then the feed.”

---

*This file describes everything done in Phase 2 in simple terms so you can explain it clearly in your videos.*
