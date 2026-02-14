# Phase 3 – Stories Section (What We Did & Why)

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
- **Viewer:** Full-screen overlay (backdrop + content). Shows story image, header with user avatar and username, and a close button. Backdrop click or close button sets `selectedStory` to `null`.

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
src/app/features/
├── home/
│   ├── home.component.ts    (updated – imports StoriesComponent)
│   ├── home.component.html  (updated – app-stories + placeholder)
│   └── home.component.scss  (updated – .home wrapper)
├── stories/                  (new)
│   ├── stories.component.ts
│   ├── stories.component.html
│   └── stories.component.scss
└── placeholder/
    └── ...
```

---

## 4. Rules We Still Follow

| Rule              | Phase 3 usage |
|-------------------|----------------|
| **HTML = structure** | Story items, buttons, viewer overlay, no inline styles. |
| **SCSS = styling**   | Story ring, scroll, viewer layout and theme variables. |
| **TS = logic**       | Data from assets, `getUserById`, `otherStories`, click and close. |
| **Data in assets**   | `users` and `stories` from `assets/data`. |

---

## 5. Complete Code for Phase 3 (Copy Exactly)

**Use this after Phase 2.** For files that already existed and were updated (Home), the code below is the **complete** file (Phase 1 + 2 + 3). For new files (Stories), create them and paste.

---

### New in Phase 3: `src/app/features/stories/stories.component.ts`

```ts
import { Component } from '@angular/core';
import { users } from '../../../assets/data/users';
import { stories } from '../../../assets/data/stories';
import type { User } from '../../../assets/data/users';
import type { Story } from '../../../assets/data/stories';

@Component({
  selector: 'app-stories',
  standalone: true,
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss',
})
export class StoriesComponent {
  currentUser = users[4];
  storiesList = stories;

  getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  get otherStories(): Story[] {
    return this.storiesList.filter((s) => s.userId !== this.currentUser.id);
  }

  onStoryClick(story: Story): void {
    const user = this.getUserById(story.userId);
    if (user && story.mediaUrl) {
      this.selectedStory = { story, user };
    }
  }

  selectedStory: { story: Story; user: User } | null = null;

  closeViewer(): void {
    this.selectedStory = null;
  }
}
```

---

### New in Phase 3: `src/app/features/stories/stories.component.html`

```html
<div class="stories">
  <div class="stories__scroll">
    <div class="stories__item stories__item--your">
      <button type="button" class="story-ring story-ring--your" aria-label="Your story">
        <span class="story-ring__avatar-wrap">
          <img
            [src]="currentUser.avatarUrl"
            [alt]="currentUser.displayName"
            class="story-ring__avatar"
            width="56"
            height="56"
          />
        </span>
        <span class="stories__label">Your story</span>
      </button>
    </div>
    @for (item of otherStories; track item.id) {
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

  @if (selectedStory) {
    <div class="stories-viewer" role="dialog" aria-modal="true" aria-label="Story">
      <div class="stories-viewer__backdrop" (click)="closeViewer()"></div>
      <div class="stories-viewer__content">
        <button
          type="button"
          class="stories-viewer__close"
          aria-label="Close"
          (click)="closeViewer()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="stories-viewer__header">
          <img
            [src]="selectedStory.user.avatarUrl"
            [alt]="selectedStory.user.displayName"
            class="stories-viewer__avatar"
            width="32"
            height="32"
          />
          <span class="stories-viewer__username">{{ selectedStory.user.username }}</span>
        </div>
        <img
          [src]="selectedStory.story.mediaUrl"
          [alt]="selectedStory.user.username + ' story'"
          class="stories-viewer__media"
        />
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

.stories__scroll {
  display: flex;
  gap: $space-4;
  overflow-x: auto;
  padding: $space-2 0 $space-2 $space-4;
  @include hide-scrollbar;
}

.stories__item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
}

.stories__item--your {
  .story-ring--your .story-ring__avatar-wrap {
    border: 2px solid $border-primary;
  }
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

.stories-viewer__close {
  position: absolute;
  top: $space-2;
  right: $space-2;
  z-index: 2;
  width: 32px;
  height: 32px;
  @include flex-center;
  color: $text-primary;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.stories-viewer__header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-4;
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
