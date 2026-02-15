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
│   ├── svgs.ts               (custom SVG registry; use Lucide via icons.ts)
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
| **SVGs**             | No inline SVG in components. Custom SVGs (if needed) go in `src/app/core/svgs.ts`. |

---

## 6. Complete Code for Phase 4 (Copy Exactly)

---

### New in Phase 4: `src/app/features/feed/post.component.ts`

```ts
import { Component, input, signal, effect } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
} from '../../core/icons';
import type { Post, User, Comment } from '../../../assets/data';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  readonly Bookmark = Bookmark;
  readonly MoreHorizontal = MoreHorizontal;
  readonly BadgeCheck = BadgeCheck;

  post = input.required<Post>();
  user = input.required<User>();
  comments = input<Comment[]>([]);
  getUserById = input.required<(id: string) => User | undefined>();

  private liked = signal<boolean>(false);
  private likeCount = signal<number>(0);

  constructor() {
    effect(() => {
      const p = this.post();
      if (p) {
        this.liked.set(p.isLiked ?? false);
        this.likeCount.set(p.likesCount ?? 0);
      }
    });
  }

  get isLiked(): boolean {
    return this.liked();
  }

  get likesCount(): number {
    return this.likeCount();
  }

  toggleLike(): void {
    this.liked.update((v) => !v);
    this.likeCount.update((c) => (this.liked() ? c + 1 : Math.max(0, c - 1)));
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
}
```

---

### New in Phase 4: `src/app/features/feed/post.component.html`

```html
@let p = post();
@let u = user();
@let postComments = comments();
@let getAuthor = getUserById();

@if (p && u) {
  <article class="post">
    <header class="post__header">
      <img
        [src]="u.avatarUrl"
        [alt]="u.displayName"
        class="post__avatar"
        width="32"
        height="32"
      />
      <div class="post__header-info">
        <span class="post__username">{{ u.username }}</span>
        @if (u.isVerified) {
          <lucide-icon [img]="BadgeCheck" class="post__verified" [size]="14" aria-label="Verified"></lucide-icon>
        }
        <span class="post__header-time">· {{ relativeTime(p.timestamp) }}</span>
      </div>
      <button type="button" class="post__more" aria-label="More options">
        <lucide-icon [img]="MoreHorizontal" [size]="24"></lucide-icon>
      </button>
    </header>

    <div class="post__image-wrap">
      <img
        [src]="p.imageUrl"
        [alt]="p.caption || 'Post image'"
        class="post__image"
      />
    </div>

    <div class="post__actions">
      <div class="post__actions-left">
        <button
          type="button"
          class="post__action"
          [class.post__action--active]="isLiked"
          (click)="toggleLike()"
          [attr.aria-pressed]="isLiked"
          aria-label="Like"
        >
          <lucide-icon [img]="Heart" class="post__action-icon" [size]="24" [strokeWidth]="2"></lucide-icon>
        </button>
        <button type="button" class="post__action" aria-label="Comment">
          <lucide-icon [img]="MessageCircle" class="post__action-icon" [size]="24"></lucide-icon>
        </button>
        <button type="button" class="post__action" aria-label="Share">
          <lucide-icon [img]="Send" class="post__action-icon" [size]="24"></lucide-icon>
        </button>
      </div>
      <button type="button" class="post__action post__action--save" aria-label="Save">
        <lucide-icon [img]="Bookmark" class="post__action-icon" [size]="24"></lucide-icon>
      </button>
    </div>

    @if (likesCount > 0) {
      <p class="post__likes">{{ likesCount }} {{ likesCount === 1 ? 'like' : 'likes' }}</p>
    }

    <div class="post__caption">
      <span class="post__caption-username">{{ u.username }}</span>
      <span class="post__caption-text">{{ p.caption }}</span>
    </div>

    @if (postComments.length > 0) {
      <button type="button" class="post__view-comments">
        View all {{ p.commentsCount }} comments
      </button>
      <ul class="post__comments">
        @for (comment of postComments; track comment.id) {
          @let commentUser = getAuthor(comment.userId);
          <li class="post__comment">
            @if (commentUser) {
              <span class="post__comment-username">{{ commentUser.username }}</span>
            }
            <span class="post__comment-text">{{ comment.text }}</span>
          </li>
        }
      </ul>
    }

    <time class="post__time" [attr.datetime]="p.timestamp">
      {{ relativeTime(p.timestamp) }}
    </time>
  </article>
}
```

---

### New in Phase 4: `src/app/features/feed/post.component.scss`

```scss
@use '../../../styles/variables' as *;

.post {
  background: $bg-primary;
  border: 1px solid $border-primary;
  border-radius: 8px;
  margin-bottom: $space-6;
  overflow: hidden;
}

.post__header {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
}

.post__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.post__header-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $space-2;
}

.post__username {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.post__verified {
  color: $accent;
  flex-shrink: 0;
}

.post__header-time {
  color: $text-muted;
  font-size: $font-size-sm;
  font-weight: $font-weight-normal;
}

.post__more {
  background: none;
  border: none;
  color: $text-primary;
  padding: $space-2;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: $bg-hover;
  }
}

.post__image-wrap {
  width: 100%;
  aspect-ratio: 1;
  background: $bg-secondary;
}

.post__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.post__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-2 $space-4 $space-2 $space-2;
}

.post__actions-left {
  display: flex;
  align-items: center;
  gap: $space-4;
}

.post__action {
  background: none;
  border: none;
  color: $text-primary;
  padding: $space-2;
  cursor: pointer;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }

  &--active {
    color: $error;

    .post__action-icon svg {
      fill: currentColor;
    }
  }

  &--save {
    margin-left: auto;
  }
}

.post__action-icon {
  display: inline-flex;
}

.post__likes {
  margin: 0 $space-4 $space-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.post__caption {
  padding: 0 $space-4 $space-2;
  font-size: $font-size-sm;
  color: $text-primary;
  line-height: 1.4;
}

.post__caption-username {
  font-weight: $font-weight-semibold;
  margin-right: $space-2;
}

.post__caption-text {
  font-weight: $font-weight-normal;
}

.post__view-comments {
  background: none;
  border: none;
  color: $text-muted;
  font-size: $font-size-sm;
  padding: 0 $space-4 $space-2;
  cursor: pointer;
  margin: 0;
  display: block;
  text-align: left;

  &:hover {
    color: $text-secondary;
  }
}

.post__comments {
  list-style: none;
  margin: 0 0 $space-2;
  padding: 0 $space-4;
}

.post__comment {
  font-size: $font-size-sm;
  color: $text-primary;
  margin-bottom: $space-2;
  line-height: 1.4;
}

.post__comment-username {
  font-weight: $font-weight-semibold;
  margin-right: $space-2;
}

.post__time {
  display: block;
  padding: 0 $space-4 $space-4;
  font-size: $font-size-xs;
  color: $text-muted;
  text-transform: uppercase;
}
```

---

### Updated in Phase 4: `src/app/features/home/home.component.ts` (complete)

```ts
import { Component } from '@angular/core';
import { StoriesComponent } from '../stories/stories.component';
import { PostComponent } from '../feed/post.component';
import { posts } from '../../../assets/data/posts';
import { comments } from '../../../assets/data/comments';
import { users } from '../../../assets/data/users';
import type { User } from '../../../assets/data';
import type { Comment } from '../../../assets/data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StoriesComponent, PostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  posts = posts;

  getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  getUserByIdRef = (id: string): User | undefined => this.getUserById(id);

  getCommentsForPost(postId: string): Comment[] {
    return comments.filter((c) => c.postId === postId);
  }
}
```

---

### Updated in Phase 4: `src/app/features/home/home.component.html` (complete)

```html
<div class="home">
  <app-stories />
  <section class="home-feed">
    @for (p of posts; track p.id) {
      @let author = getUserById(p.userId);
      @if (author) {
        <app-post
          [post]="p"
          [user]="author"
          [comments]="getCommentsForPost(p.id)"
          [getUserById]="getUserByIdRef"
        />
      }
    }
  </section>
</div>
```

---

### Updated in Phase 4: `src/app/features/home/home.component.scss` (complete)

```scss
@use '../../../styles/variables' as *;

.home {
  width: 100%;
  max-width: $feed-max-width;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-feed {
  width: 100%;
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

## 7. How to Run and What to See

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

Phase 5 adds **Search** (search bar and user results). See PHASE-5.md. Phase 6 could add **direct messages** or **notifications**.

---

*This file describes Phase 4 and how the feed and post component are wired to posts and comments data.*
