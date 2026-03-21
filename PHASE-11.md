# Phase 11 - Create as Global Modal (Instagram-like)

## Goal

Implement Create exactly like Instagram web behavior:

- Create opens as a modal overlay from sidebar on any page
- It does not navigate to a standalone Create page
- Modal closes on backdrop click, close button, or `Esc`
- Body scroll is locked when modal is open
- Create flow is staged: Select -> Crop -> Details
- After Share: modal auto-closes and toast appears at bottom-left
- Unwanted page/modal scroll is removed by constraining modal and composer heights
- Created posts persist in localStorage (including uploaded images)
- Created posts are injected into Home feed and Profile grid

---

## Files updated

| # | File | Action |
|---|------|--------|
| 1 | `src/app/core/create-modal.service.ts` | Added modal state + toast state |
| 2 | `src/app/features/create/create-modal.component.ts` | Added global modal wrapper + body scroll lock |
| 3 | `src/app/features/create/create-modal.component.html` | Added overlay dialog + toast render |
| 4 | `src/app/features/create/create-modal.component.scss` | Added modal sizing + no-scroll behavior + toast styles |
| 5 | `src/app/layout/left-sidebar/left-sidebar.component.ts` | Open modal on Create click |
| 6 | `src/app/layout/main-layout/main-layout.component.ts` | Mount modal globally and remove `/create` from immersive route set |
| 7 | `src/app/layout/main-layout/main-layout.component.html` | Added `<app-create-modal />` |
| 8 | `src/app/app.routes.ts` | `/create` now redirects to home |
| 9 | `src/app/features/create/create.component.ts` | Share now auto-closes modal and triggers toast |
| 10 | `src/app/features/create/create.component.scss` | Removed viewport-forcing styles causing unwanted scroll |
| 11 | `src/app/core/created-posts.service.ts` | Shared localStorage-backed created post store |
| 12 | `src/app/features/home/home.component.ts` | Merge created posts into feed |
| 13 | `src/app/features/profile/profile.component.ts` | Merge created posts into profile grid |

---

## 1) Modal service with toast

`src/app/core/create-modal.service.ts`

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreateModalService {
  readonly isOpen = signal(false);
  readonly toastMessage = signal<string | null>(null);

  private toastTimerId: number | null = null;

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  showToast(message: string, durationMs = 2200): void {
    this.toastMessage.set(message);

    if (this.toastTimerId !== null) {
      window.clearTimeout(this.toastTimerId);
    }

    this.toastTimerId = window.setTimeout(() => {
      this.toastMessage.set(null);
      this.toastTimerId = null;
    }, durationMs);
  }
}
```

---

## 2) Auto-close + toast after Share

`src/app/features/create/create.component.ts`

```ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CreateModalService } from '../../core/create-modal.service';
import { CreatedPostsService, type CreatedPost } from '../../core/created-posts.service';

// ...types omitted for brevity

export class CreateComponent {
  private readonly createModal = inject(CreateModalService);
  private readonly createdPosts = inject(CreatedPostsService);

  // ...state omitted for brevity

  publish(): void {
    if (!this.canPublish()) {
      return;
    }

    const item: CreatedPost = {
      id: `new-${Date.now()}`,
      imageUrl: this.imageUrl().trim(),
      aspectRatio: this.aspectRatio(),
      caption: this.caption().trim(),
      location: this.location().trim(),
      privacy: this.privacy(),
      commentsEnabled: this.commentsEnabled(),
      hideLikeCount: this.hideLikeCount(),
      createdAt: new Date().toISOString(),
    };

    this.createdPosts.add(item);
    this.step.set('select');
    this.imageUrl.set('');
    this.imageSourceLabel.set('No media selected');
    this.aspectRatio.set('portrait');
    this.caption.set('');
    this.location.set('');
    this.collaborators.set('');
    this.selectUrlDraft.set('');
    this.privacy.set('Public');
    this.commentsEnabled.set(true);
    this.hideLikeCount.set(false);

    this.createModal.close();
    this.createModal.showToast('Post shared');
  }
}
```

### Storage is centralized in `CreatedPostsService`

`src/app/core/created-posts.service.ts`

```ts
const CREATED_POSTS_STORAGE_KEY = 'instagram-clone:create-posts';

constructor() {
  this.loadFromStorage();
}

add(post: CreatedPost): void {
  this.createdPostsState.update((items) => {
    const next = [post, ...items];
    this.saveToStorage(next);
    return next;
  });
}

private loadFromStorage(): void {
  // SSR-safe guard + localStorage parse + runtime validation + signal set
}

private saveToStorage(postsToSave: CreatedPost[]): void {
  // SSR-safe guard + localStorage.setItem(...)
}
```

The Create component still reads files as Data URLs, so uploaded images survive refresh when persisted.

### Shared post injection into Home + Profile

`src/app/core/created-posts.service.ts`

- Stores created posts in localStorage.
- Exposes `feedPosts` computed signal mapped to app `Post` shape (`userId = 'u5'`).

`src/app/features/home/home.component.ts`

- Uses `CreatedPostsService` and computes feed as:
  - created posts first
  - then static mock posts

`src/app/features/profile/profile.component.ts`

- Uses the same service and merges created posts with static posts.
- Profile now immediately includes newly shared posts from current user.

---

## 3) No-scroll modal and toast UI

`src/app/features/create/create-modal.component.html`

```html
@if (modal.isOpen()) {
  <section class="create-modal" role="dialog" aria-modal="true" aria-label="Create post" (click)="close()">
    <button type="button" class="create-modal__close" aria-label="Close create modal" (click)="close()">
      <lucide-icon [img]="X" [size]="24"></lucide-icon>
    </button>

    <div class="create-modal__dialog" (click)="$event.stopPropagation()">
      <app-create />
    </div>
  </section>
}

@if (modal.toastMessage(); as message) {
  <div class="create-toast" role="status" aria-live="polite">
    {{ message }}
  </div>
}
```

`src/app/features/create/create-modal.component.scss`

```scss
.create-modal {
  position: fixed;
  inset: 0;
  z-index: 140;
  background: rgb(0 0 0 / 68%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-3;
}

.create-modal__dialog {
  width: min(980px, calc(100vw - 2rem));
  max-height: calc(100vh - 1.5rem);
  overflow: hidden;
  border-radius: 14px;
}

.create-toast {
  position: fixed;
  left: $space-4;
  bottom: $space-4;
  z-index: 145;
  background: rgb(38 38 38 / 95%);
  color: $text-primary;
  border: 1px solid $border-secondary;
  border-radius: 10px;
  padding: $space-2 $space-3;
  font-size: $font-size-sm;
  box-shadow: 0 12px 28px rgb(0 0 0 / 40%);
}
```

---

## 4) Scroll fix in Create content

`src/app/features/create/create.component.scss`

```scss
.create {
  width: 100%;
  max-width: none;
  min-height: 0;
  margin: 0 auto;
  padding: 0;
}

.create__shell {
  border: 1px solid $border-primary;
  border-radius: 14px;
  background: $bg-secondary;
  overflow: hidden;
  min-height: 0;
  height: min(720px, calc(100vh - 2rem));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}
```

This removes viewport-forcing dimensions that caused unwanted scrollbars.

---

## 5) Routing / layout integration

`src/app/app.routes.ts`

```ts
{ path: 'create', redirectTo: '', pathMatch: 'full' },
```

`src/app/layout/main-layout/main-layout.component.html`

```html
<app-create-modal />
```

`src/app/layout/left-sidebar/left-sidebar.component.ts`

- Intercepts `/create` click and opens modal via service.

---

## Verify

```bash
ng build
ng serve
```

Manual checks:

1. On Home/Profile/Messages, click Create and confirm modal opens on top of current page.
2. Confirm there is no unwanted background/page scroll while modal is open.
3. Complete Create flow and click Share.
4. Confirm modal auto-closes.
5. Confirm bottom-left toast appears: `Post shared`.
6. Refresh the page and confirm `Recently shared` posts (with images) are restored.
7. Go to Home and confirm new post appears at top of feed.
8. Go to Profile and confirm new post appears in profile grid.
