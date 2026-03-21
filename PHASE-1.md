# Phase 1 – Foundation (What We Did & Why)

> Sync note (2026-03-21): Phase 1 code blocks were re-checked and kept as the intended Phase 1 baseline. Shared files that evolve later (like routing/layout) are updated in later phase docs.

This document explains **everything we did in Phase 1** in simple terms so you can make clear videos from it. Each section can become a video or a part of a video.

---

## What is Phase 1?

**Phase 1 is the foundation.** We did not build the Instagram UI yet. We only:

1. Removed the default Angular welcome screen.
2. Set up a **dark theme** and global styles.
3. Put all **mock data** in one place (assets folder).
4. Added a **simple home page** and routing so the app runs and shows something.

**Why?** So later we can build the layout and features on a clean, consistent base without mixing styles or data all over the place.

---

## 1. Removing the Angular Welcome Screen

### What was there before?

When you create a new Angular project, Angular gives you a **welcome page** with:

- The Angular logo
- “Hello, instagram-clone”
- Links to docs, GitHub, etc.
- A lot of inline CSS (styles written inside the HTML file)

### What we did

- **Replaced the whole welcome template** with a minimal shell.
- Now the app only shows: a wrapper `div` and a **router outlet** (the place where each page will appear).

### Files we changed

| File | What we did |
|------|----------------|
| `src/app/app.html` | Deleted all the welcome content and kept only: one `div` with class `app-wrapper` and `<router-outlet />` inside it. |
| `src/app/app.ts` | Removed the `title` signal and any extra logic. Left only the component with `RouterOutlet` so routing works. |
| `src/app/app.scss` | Kept it minimal: only one class `.app-wrapper` with `min-height: 100vh` so the app fills the screen. |

### Simple explanation for your video

- **HTML** = structure only. We don’t put styles or logic here.
- **TS** = logic and wiring (e.g. routing). No styling.
- **SCSS** = styling only. No business logic.

So: **HTML = structure, TS = logic, SCSS = style.** We follow this in the whole project.

---

## 2. Setting Up the Dark Theme (Global SCSS)

### What we did

We created a **global dark theme** so the whole app looks like Instagram’s dark mode. All colors and spacing are defined in one place so we can reuse them everywhere.

### New files we created

#### `src/styles/_variables.scss`

- **What it is:** A file that holds **all theme values** in one place.
- **What’s inside:**
  - **Background colors:** black, dark gray, etc. (`$bg-primary`, `$bg-secondary`, …).
  - **Text colors:** white/light gray for text (`$text-primary`, `$text-secondary`).
  - **Borders:** subtle grays for borders (`$border-primary`, …).
  - **Accent:** Instagram-like blue for links and buttons (`$accent`, `$accent-hover`).
  - **Spacing:** small to large values (`$space-1` to `$space-10`) so we use the same padding/margin everywhere.
  - **Typography:** font family, font sizes, font weights.
  - **Layout:** heights and widths (e.g. header height, sidebar width, feed max width).

**Why a separate file?** So we change the theme in **one file** and the whole app updates. No hunting for color codes in many components.

#### `src/styles/_mixins.scss`

- **What it is:** Reusable **style patterns** (mixins).
- **What’s inside:**
  - `flex-center` – center content with flexbox.
  - `flex-between` – put items on left and right with flexbox.
  - `truncate` – cut long text with “...” (ellipsis).
  - `line-clamp` – limit text to a few lines.
  - `focus-ring` – visible focus outline for accessibility.
  - `hide-scrollbar` – hide the scrollbar but keep scrolling.

**Why?** So we don’t repeat the same CSS in many components. We write it once and reuse it.

#### `src/styles.scss` (updated)

- **What it is:** The **main global style file** that applies to the whole app.
- **What we did:**
  - We **import** the variables and mixins from the two files above (`@use 'styles/variables'` and `@use 'styles/mixins'`).
  - We added **reset/base styles**: box-sizing, body background (black), text color (light), link and button defaults, list reset.

**Why?** So every page gets the same base look (dark background, same font, no default margins that break our layout).

### Simple explanation for your video

- **Variables** = “single source of truth” for colors, spacing, fonts. Change once, apply everywhere.
- **Mixins** = “reusable style blocks.” Use them in any component SCSS.
- **styles.scss** = “global rules” that apply to the entire app (body, links, buttons, etc.).

---

## 3. Putting All Data in the Assets Folder

### What we did

We created a **data folder** inside `src/assets/data/` and put **all mock data** there. Every list (users, stories, posts, comments, suggestions) is exported from TypeScript files. No data is hard-coded inside components.

### Why?

- **One place for data** – easy to find and update.
- **Clean components** – components only handle display and user actions; they **import** data from assets.
- **Easy to replace later** – when you add a real API, you can swap the import with a service that fetches from the server.

### Files we created

| File | What it contains |
|------|-------------------|
| `src/assets/data/users.ts` | List of **users**: id, username, displayName, avatarUrl, isVerified. We also export a **User** interface (the “shape” of one user). |
| `src/assets/data/stories.ts` | List of **stories**: id, userId, mediaUrl, timestamp, seen. Plus **Story** interface. |
| `src/assets/data/posts.ts` | List of **posts**: id, userId, imageUrl, caption, likesCount, commentsCount, timestamp, isLiked, isSaved. Plus **Post** interface. |
| `src/assets/data/comments.ts` | List of **comments**: id, postId, userId, text, timestamp. Plus **Comment** interface. |
| `src/assets/data/suggestions.ts` | List of **suggestions**: userId, reason, mutualCount. Plus **Suggestion** interface. |
| `src/assets/data/index.ts` | **Central export.** It re-exports everything from the files above. So in the app we can do: `import { users, posts, stories } from '../assets/data';` (or your path to assets/data). |

### Simple explanation for your video

- **Interface** = TypeScript “contract” for one item (e.g. a User has id, username, avatarUrl, etc.). It helps with autocomplete and fewer bugs.
- **Export** = we put `export` in front of the array and the interface so other files can **import** and use them.
- **index.ts** = “barrel file.” Instead of importing from 5 different files, we import from one file (`index.ts`) and get users, posts, stories, etc. from there.

---

## 4. Adding a Simple Home Page and Routing

### What we did

- We created a **Home** component that shows a short message.
- We set up **routing** so when you open the app, you see the Home page. Any unknown URL redirects back to home.

### Files we created/updated

#### `src/app/features/home/home.component.ts`

- **What it is:** The **Home** component (logic only).
- **What’s inside:** A simple standalone component with no extra logic. It only says: use `home.component.html` for template and `home.component.scss` for styles.

**Why in `features/home/`?** We group by **feature**. Home is one feature; later we’ll add features like “stories,” “feed,” “suggestions.” Each feature has its own folder.

#### `src/app/features/home/home.component.html`

- **What it is:** The **structure** of the Home page.
- **What’s inside:** A div with a heading “Instagram Clone” and a line of text: “Phase 1 – Dark theme & data ready. Layout next.”

No styles here, no logic—only structure and text.

#### `src/app/features/home/home.component.scss`

- **What it is:** The **styles** for the Home page only.
- **What we did:** We used the **global variables** (`@use '../../../styles/variables'`) and wrote styles for the placeholder (centered content, title, subtitle). So we follow: **SCSS = styling only**, and we reuse the theme from `_variables.scss`.

#### `src/app/app.routes.ts`

- **What we did:** We defined two routes:
  - **Path `''` (empty):** Show `HomeComponent`.
  - **Path `'**'` (anything else):** Redirect to `''` (home).

So when someone goes to `/` or any wrong URL, they see the Home page.

### Simple explanation for your video

- **Component** = one piece of the UI with its own **HTML** (structure), **SCSS** (style), and **TS** (logic).
- **Routing** = which URL shows which component. We configured “home page = Home component.”
- **features/home/** = we keep the app organized by feature, not by file type. All Home-related files live in one folder.

---

## 5. Folder Structure After Phase 1

```
src/
├── app/
│   ├── app.html, app.ts, app.scss     ← Root component (minimal shell)
│   ├── app.routes.ts                  ← Routes (home + redirect)
│   ├── app.config.ts
│   └── features/
│       └── home/                      ← First feature
│           ├── home.component.ts
│           ├── home.component.html
│           └── home.component.scss
├── assets/
│   └── data/                          ← All mock data (Phase 1)
│       ├── index.ts                   ← Export everything from here
│       ├── users.ts
│       ├── stories.ts
│       ├── posts.ts
│       ├── comments.ts
│       └── suggestions.ts
├── styles/
│   ├── _variables.scss                ← Theme (colors, spacing, fonts)
│   ├── _mixins.scss                   ← Reusable style patterns
│   └── (styles.scss is in src/)
├── styles.scss                        ← Global styles (imports variables & mixins)
├── index.html
└── main.ts
```

You can show this in a video and say: “We have a clear place for app shell, features, data, and global styles.”

---

## 6. Complete Code for Phase 1 (Copy Exactly)

Use the code below for each file **exactly as it appears**. This is the state at the **end of Phase 1**. If you follow phase by phase, type or paste this code so you have the full working Phase 1 before starting Phase 2.

---

### `src/app/app.html`

```html
<div class="app-wrapper">
  <router-outlet />
</div>
```

---

### `src/app/app.ts`

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
```

---

### `src/app/app.scss`

```scss
// App-level styles (keep minimal; use global styles and component SCSS)
.app-wrapper {
  min-height: 100vh;
}
```

---

### `src/app/app.routes.ts` (Phase 1 – simple routes only)

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
```

---

### `src/styles/_variables.scss` (Phase 1 – no sidebar-width-collapsed yet)

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
$feed-max-width: 470px;
$right-sidebar-width: 320px;
```

---

### `src/styles/_mixins.scss`

```scss
// ============================================
// Reusable SCSS mixins
// ============================================

@use 'variables' as *;

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@mixin focus-ring {
  outline: 2px solid $accent;
  outline-offset: 2px;
}

@mixin hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

---

### `src/styles.scss`

```scss
// ============================================
// Global styles – Instagram clone (dark mode)
// ============================================

@use 'styles/variables' as *;
@use 'styles/mixins' as *;

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  font-family: $font-family;
  font-size: $font-size-base;
  color: $text-primary;
  background-color: $bg-primary;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

ul,
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

---

### `src/assets/data/users.ts`

```ts
/**
 * Mock users – import from assets/data for feed, stories, suggestions.
 */

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified?: boolean;
}

export const users: User[] = [
  {
    id: 'u1',
    username: 'angular_dev',
    displayName: 'Angular Dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=angular',
    isVerified: false,
  },
  {
    id: 'u2',
    username: 'web_teacher',
    displayName: 'Web Teacher',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
    isVerified: true,
  },
  {
    id: 'u3',
    username: 'frontend_fan',
    displayName: 'Frontend Fan',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
    isVerified: false,
  },
  {
    id: 'u4',
    username: 'code_explorer',
    displayName: 'Code Explorer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer',
    isVerified: false,
  },
  {
    id: 'u5',
    username: 'you',
    displayName: 'You',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
    isVerified: false,
  },
];
```

---

### `src/assets/data/stories.ts`

```ts
/**
 * Mock stories – import from assets/data for story section.
 */

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  timestamp: string;
  seen?: boolean;
}

export const stories: Story[] = [
  { id: 's1', userId: 'u5', mediaUrl: '', timestamp: new Date().toISOString(), seen: false },
  { id: 's2', userId: 'u1', mediaUrl: 'https://picsum.photos/400/600?random=1', timestamp: new Date(Date.now() - 3600000).toISOString(), seen: false },
  { id: 's3', userId: 'u2', mediaUrl: 'https://picsum.photos/400/600?random=2', timestamp: new Date(Date.now() - 7200000).toISOString(), seen: true },
  { id: 's4', userId: 'u3', mediaUrl: 'https://picsum.photos/400/600?random=3', timestamp: new Date(Date.now() - 10800000).toISOString(), seen: false },
  { id: 's5', userId: 'u4', mediaUrl: 'https://picsum.photos/400/600?random=4', timestamp: new Date(Date.now() - 14400000).toISOString(), seen: true },
];
```

---

### `src/assets/data/posts.ts`

```ts
/**
 * Mock posts – import from assets/data for feed.
 */

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const posts: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    imageUrl: 'https://picsum.photos/600/600?random=10',
    caption: 'Building something cool with Angular today. #angular #webdev',
    likesCount: 124,
    commentsCount: 8,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'p2',
    userId: 'u2',
    imageUrl: 'https://picsum.photos/600/600?random=11',
    caption: 'Teaching clean code: SCSS for style, TS for logic, HTML for structure.',
    likesCount: 89,
    commentsCount: 12,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'p3',
    userId: 'u3',
    imageUrl: 'https://picsum.photos/600/600?random=12',
    caption: 'Dark mode everywhere. Best for the eyes.',
    likesCount: 256,
    commentsCount: 24,
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    isLiked: false,
    isSaved: true,
  },
];
```

---

### `src/assets/data/comments.ts`

```ts
/**
 * Mock comments – import from assets/data for post comments.
 */

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  timestamp: string;
}

export const comments: Comment[] = [
  { id: 'c1', postId: 'p1', userId: 'u2', text: 'Nice setup!', timestamp: new Date(Date.now() - 3000000).toISOString() },
  { id: 'c2', postId: 'p1', userId: 'u3', text: 'Which Angular version?', timestamp: new Date(Date.now() - 2800000).toISOString() },
  { id: 'c3', postId: 'p1', userId: 'u1', text: 'Latest stable.', timestamp: new Date(Date.now() - 2600000).toISOString() },
  { id: 'c4', postId: 'p2', userId: 'u4', text: 'Love this approach.', timestamp: new Date(Date.now() - 6000000).toISOString() },
  { id: 'c5', postId: 'p2', userId: 'u1', text: 'Thanks!', timestamp: new Date(Date.now() - 5800000).toISOString() },
  { id: 'c6', postId: 'p3', userId: 'u2', text: 'Agreed, dark mode is the way.', timestamp: new Date(Date.now() - 12000000).toISOString() },
];
```

---

### `src/assets/data/suggestions.ts`

```ts
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
```

---

### `src/assets/data/index.ts`

```ts
/**
 * Central export for all mock data – import from assets/data.
 */

export { users, type User } from './users';
export { stories, type Story } from './stories';
export { posts, type Post } from './posts';
export { comments, type Comment } from './comments';
export { suggestions, type Suggestion } from './suggestions';
```

---

### `src/app/features/home/home.component.ts`

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
```

---

### `src/app/features/home/home.component.html`

```html
<div class="home-placeholder">
  <h1>Instagram Clone</h1>
  <p>Phase 1 – Dark theme &amp; data ready. Layout next.</p>
</div>
```

---

### `src/app/features/home/home.component.scss`

```scss
@use '../../../styles/variables' as *;

.home-placeholder {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-6;

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

## 7. Rules We Follow (For Your Videos)

| Rule | Meaning |
|------|--------|
| **HTML = structure only** | No inline styles, no business logic. Just layout and bindings (like `*ngFor`, `(click)`). |
| **SCSS = styling only** | All colors, spacing, flexbox, etc. go in SCSS. Use variables and mixins from `styles/`. |
| **TS = logic only** | Data loading, click handlers, state. No style-related code. |
| **Data in assets** | Mock data lives in `src/assets/data/`. Components import from there (or via a service later). |
| **Icons in one place** | From Phase 2 onward, Lucide icons are imported from **`src/app/core/icons.ts`** so we can track and reuse them in one file. |
| **SVGs** | No inline SVG in components. Icons via Lucide (`core/icons.ts`). Any custom SVG goes in **`src/app/core/svgs.ts`** (or `assets/svg/`). |

You can repeat these in every video so viewers learn the habit.

---

## 8. How to Run the App

```bash
cd instagram-clone
npm start
```

Then open the URL shown (usually `http://localhost:4200`). You should see:

- A **black/dark** screen (dark theme).
- The text **“Instagram Clone”** and **“Phase 1 – Dark theme & data ready. Layout next.”**

No Angular logo, no welcome links. That means Phase 1 is done.

---

## 9. What You Can Teach in Phase 1 (Video Ideas)

1. **“Removing the Angular welcome screen”** – Why we replace the default template and keep only router-outlet; what each of app.html, app.ts, app.scss does.
2. **“Setting up a dark theme with SCSS”** – What variables and mixins are; how we use `_variables.scss` and `_mixins.scss` and import them in `styles.scss`.
3. **“Where to keep data: the assets folder”** – Why we put mock data in `assets/data`, what interfaces are, and how `index.ts` re-exports everything.
4. **“Your first feature: Home component and routing”** – How we create a feature folder, add a component with HTML/SCSS/TS, and register a route in `app.routes.ts`.
5. **“Project structure and our three rules”** – Walk through the folder structure and explain: HTML = structure, SCSS = style, TS = logic; data from assets.

---

## 10. What’s Next (Phase 2)

Phase 2 will add the **layout shell**:

- Left sidebar (or top bar) with logo and navigation (Home, Search, Messages, Notifications, Create, Profile).
- Center area (where feed will go).
- Right sidebar (where suggestions will go).
- Responsive base so the layout works on different screen sizes.

You can end Phase 1 videos by saying: “Next we’ll build the layout and plug in the data we already have.”

---

*This file describes everything done in Phase 1 in simple terms so you can explain it clearly in your videos.*
