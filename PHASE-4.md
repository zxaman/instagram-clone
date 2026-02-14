# Phase 4 – Feed (Posts & Comments)

This document explains **what we did in Phase 4**: adding the **feed** with a post list, post component (header, image, caption, like/comment/share), and comments from data.

---

## What is Phase 4?

**Phase 4 adds the Feed** below the stories on the home screen:

1. **Post list** – Posts from `assets/data/posts.ts` are shown in order. Each post is rendered by a dedicated **Post** component.
2. **Post component** – For each post:
   - **Header:** Post author’s avatar, username, optional verified badge, and a “more” (⋯) button.
   - **Image:** Full-width post image.
   - **Actions:** Like (heart), Comment, Share (paper plane), and Save (bookmark). Like is toggleable and updates the displayed like count.
   - **Caption:** Username + caption text.
   - **Comments:** “View all X comments” and a list of comments from `assets/data/comments.ts`, each showing commenter username and text.
   - **Timestamp:** Relative time (e.g. 1h, 2d) below the comments.
3. **Data:** Posts, comments, and users come from `assets/data`; the home component resolves the author per post and comments per post and passes them into each `<app-post>`.

---

## 1. Post Component

### What we did

- **PostComponent** is a presentational component that receives:
  - `post` (Post), `user` (User – post author), `comments` (Comment[] for this post), and `getUserById` (function to resolve comment authors).
- **Header:** Avatar, username, verified badge (if `user.isVerified`), and a more-options button.
- **Image:** Rendered from `post.imageUrl`.
- **Actions:** Like (heart – filled when liked, red), Comment, Share, Save. Like toggles local state and updates the displayed like count (via signals and an effect that syncs from the post input).
- **Caption:** Bold username + caption.
- **Comments:** Button “View all X comments” and a list of comments; each comment shows `commentUser.username` and `comment.text` (commenter resolved via `getUserById(comment.userId)`).
- **Time:** Relative time from `post.timestamp` (e.g. 1m, 2h, 3d).

### Files we created

- `src/app/features/feed/post.component.ts` – Inputs (`post`, `user`, `comments`, `getUserById`), like state (signals + effect to sync from post), `toggleLike()`, `relativeTime()`.
- `src/app/features/feed/post.component.html` – Structure: header, image, actions, likes count, caption, view-comments button, comment list, timestamp.
- `src/app/features/feed/post.component.scss` – Dark-theme card: border, rounded corners, avatar, action buttons, caption and comment typography.

---

## 2. Home Component Updates

### What we did

- **Home** now shows the **feed** below the stories instead of the Phase 3 placeholder.
- **Data:** Import `posts`, `comments`, and `users` from `assets/data`. Implement `getUserById(id)` and `getCommentsForPost(postId)` and a bound reference `getUserByIdRef` for passing to the post component.
- **Template:** A `.home-feed` section with an `@for` over `posts`; for each post we resolve the author with `getUserById(p.userId)` and pass `post`, `user`, `comments` (for that post), and `getUserById` (via `getUserByIdRef`) into `<app-post>`.

### Files we updated

- `src/app/features/home/home.component.ts` – Import `PostComponent`, `posts`, `comments`, `users`; add `getUserById`, `getUserByIdRef`, `getCommentsForPost`; add `PostComponent` to `imports`.
- `src/app/features/home/home.component.html` – Replace placeholder with feed section and `@for` loop rendering `<app-post>` for each post.
- `src/app/features/home/home.component.scss` – Add `.home-feed` (width 100%) so the feed fills the home column.

---

## 3. Folder Structure After Phase 4

```
src/app/
├── core/
│   ├── icons.ts              (central Lucide icon registry + ICONS_IN_USE)
│   └── story-viewer.service.ts
├── features/
│   ├── home/
│   │   ├── home.component.ts    (updated – feed data + PostComponent)
│   │   ├── home.component.html  (updated – app-stories + home-feed with app-post)
│   │   └── home.component.scss  (updated – .home-feed)
│   ├── feed/                     (new)
│   │   ├── post.component.ts
│   │   ├── post.component.html
│   │   └── post.component.scss
│   ├── stories/
│   │   └── ...
│   └── placeholder/
│       └── ...
└── layout/
    └── ...
```

---

## 4. Icons (Lucide) – central registry

All icons are defined in **`src/app/core/icons.ts`**. That file re-exports the Lucide icons used across the app and an **`ICONS_IN_USE`** list so we can track usage in one place.

- **In components:** Import `LucideAngularModule` from `lucide-angular`; import icon symbols from `../../core/icons` (e.g. `import { Heart, MessageCircle } from '../../core/icons'`). Expose each on the class (e.g. `readonly Heart = Heart`) and use `<lucide-icon [img]="Heart" [size]="24">` in templates.
- **Post:** Heart, MessageCircle, Send, Bookmark, MoreHorizontal, BadgeCheck (from `core/icons`).
- **Left sidebar:** Camera, Home, Clapperboard, MessageCircle, Search, Compass, Heart, SquarePlus, User (from `core/icons`).
- **Stories:** ChevronLeft, ChevronRight, X (from `core/icons`).

To add or track icons: edit `core/icons.ts` (add to the `export { ... }` and to `ICONS_IN_USE`), then import from `core/icons` in the component. Install: `npm install lucide-angular`.

---

## 5. Rules We Follow

| Rule              | Phase 4 usage |
|-------------------|----------------|
| **HTML = structure** | Post header, image, actions, caption, comment list; no inline styles. |
| **SCSS = styling**   | Post card, avatar, buttons, caption and comment text; use theme variables. |
| **TS = logic**       | Data from assets; like state (signals + effect); relative time; parent passes post, user, comments, getUserById. |
| **Data in assets**   | `posts`, `comments`, and `users` from `assets/data`. |
| **Icons**            | Lucide icons imported from `src/app/core/icons.ts`; components use `LucideAngularModule` and `[img]="Icon"` in template. |

---

## 6. How to Run and What to See

```bash
cd instagram-clone
npm start
```

- On **Home** you should see:
  - **Stories** at the top (unchanged from Phase 3).
  - **Feed** below: a list of posts. Each post has header (avatar, username), image, like/comment/share/save actions, likes count, caption, “View all X comments”, comment list, and relative time.
- **Like** a post: the heart fills (red) and the like count updates. Toggling again unfills and decrements the count.

---

## 7. What’s Next (Phase 5)

Phase 5 could add: **direct messages** (messages list and chat UI), **search** (search bar and results), or **notifications** (notification list and mark-as-read). Choose one and we can define it in a PHASE-5.md.

---

*This file describes Phase 4 and how the feed and post component are wired to posts and comments data.*
