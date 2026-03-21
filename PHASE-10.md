# Phase 10 - Explore Page (Instagram-style grid + advanced modal)

## Goal

Build an Instagram-like Explore experience with:

- Dense discovery grid
- Reel badge on reel tiles
- Hover overlay (likes/comments)
- Click-to-open preview modal
- Large media + right-side comments panel
- Body scroll lock while modal is open
- Keyboard left/right navigation between items
- Like toggle with heart burst animation

---

## New in this update

This update adds three Instagram-style interaction upgrades:

1. Scroll lock on body while modal is open.
2. Keyboard navigation with left/right arrows inside modal.
3. Like toggle animation (heart burst) in modal.

---

## Files updated

| # | File | Action |
|---|------|--------|
| 1 | `src/app/features/explore/explore.component.ts` | Added modal interaction state + keyboard + scroll lock + like burst logic |
| 2 | `src/app/features/explore/explore.component.html` | Added modal navigation buttons and animated like control |
| 3 | `src/app/features/explore/explore.component.scss` | Added nav button, like FAB, and heart burst animation styles |

---

## Component logic

`src/app/features/explore/explore.component.ts`

```ts
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Clapperboard, Heart, MessageCircle, Send, X } from '../../core/icons';
import { exploreItems, users, type ExploreItem } from '../../../assets/data';

interface ExploreModalComment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-explore',
  imports: [LucideAngularModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeModal()',
    '(document:keydown.arrowleft)': 'onArrowLeft($event)',
    '(document:keydown.arrowright)': 'onArrowRight($event)',
  },
})
export class ExploreComponent {
  readonly Clapperboard = Clapperboard;
  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  readonly X = X;

  readonly visibleItems: ReadonlyArray<ExploreItem> = exploreItems;
  readonly selectedItem = signal<ExploreItem | null>(null);
  readonly modalComments = signal<ExploreModalComment[]>([]);
  readonly draftComment = signal('');
  readonly likedMap = signal<Record<string, boolean>>({});
  readonly likeBurstActive = signal(false);

  private readonly document = inject(DOCUMENT);
  private likeBurstTimeoutId: number | null = null;

  constructor() {
    effect((onCleanup) => {
      const body = this.document.body;
      const previousOverflow = body.style.overflow;

      body.style.overflow = this.selectedItem() ? 'hidden' : '';

      onCleanup(() => {
        body.style.overflow = previousOverflow;
      });
    });
  }

  openModal(item: ExploreItem): void {
    this.selectedItem.set(item);
    this.modalComments.set(this.buildInitialComments(item));
    this.draftComment.set('');
    this.likeBurstActive.set(false);
  }

  closeModal(): void {
    this.selectedItem.set(null);
    this.modalComments.set([]);
    this.draftComment.set('');
    this.likeBurstActive.set(false);
    if (this.likeBurstTimeoutId !== null) {
      window.clearTimeout(this.likeBurstTimeoutId);
      this.likeBurstTimeoutId = null;
    }
  }

  onArrowLeft(event: Event): void {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (!this.selectedItem()) {
      return;
    }

    event.preventDefault();
    this.showPreviousItem();
  }

  onArrowRight(event: Event): void {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (!this.selectedItem()) {
      return;
    }

    event.preventDefault();
    this.showNextItem();
  }

  setDraftComment(value: string): void {
    this.draftComment.set(value);
  }

  submitComment(): void {
    const text = this.draftComment().trim();
    if (!text) {
      return;
    }

    const next: ExploreModalComment = {
      id: `ec-${Date.now()}`,
      userId: 'u5',
      text,
      timestamp: new Date().toISOString(),
    };

    this.modalComments.update((list) => [...list, next]);
    this.draftComment.set('');
  }

  toggleModalLike(): void {
    const selected = this.selectedItem();
    if (!selected) {
      return;
    }

    const wasLiked = this.isModalItemLiked(selected.id);
    this.likedMap.update((map) => ({
      ...map,
      [selected.id]: !wasLiked,
    }));

    if (!wasLiked) {
      this.likeBurstActive.set(true);
      if (this.likeBurstTimeoutId !== null) {
        window.clearTimeout(this.likeBurstTimeoutId);
      }
      this.likeBurstTimeoutId = window.setTimeout(() => {
        this.likeBurstActive.set(false);
      }, 420);
    } else {
      this.likeBurstActive.set(false);
    }
  }

  showPreviousItem(): void {
    const selected = this.selectedItem();
    if (!selected || this.visibleItems.length < 2) {
      return;
    }

    const currentIndex = this.visibleItems.findIndex((item) => item.id === selected.id);
    const previousIndex = (currentIndex - 1 + this.visibleItems.length) % this.visibleItems.length;
    this.openModal(this.visibleItems[previousIndex]);
  }

  showNextItem(): void {
    const selected = this.selectedItem();
    if (!selected || this.visibleItems.length < 2) {
      return;
    }

    const currentIndex = this.visibleItems.findIndex((item) => item.id === selected.id);
    const nextIndex = (currentIndex + 1) % this.visibleItems.length;
    this.openModal(this.visibleItems[nextIndex]);
  }

  isModalItemLiked(itemId: string): boolean {
    return this.likedMap()[itemId] ?? false;
  }

  modalLikesCount(item: ExploreItem): number {
    return item.likesCount + (this.isModalItemLiked(item.id) ? 1 : 0);
  }

  userById(id: string) {
    return users.find((u) => u.id === id);
  }

  usernameById(id: string): string {
    return users.find((u) => u.id === id)?.username ?? 'unknown';
  }

  relativeTime(iso: string): string {
    const d = new Date(iso);
    const diff = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  formatCount(value: number): string {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }

  private buildInitialComments(item: ExploreItem): ExploreModalComment[] {
    const seeds = [
      'This is fire.',
      'Need this tutorial asap.',
      'The framing is perfect.',
      'Saved this one.',
      'Instagram vibes exactly.',
    ];
    const ids = users.map((u) => u.id);
    return seeds.slice(0, 4).map((text, index) => ({
      id: `${item.id}-c${index + 1}`,
      userId: ids[index % ids.length],
      text,
      timestamp: new Date(Date.now() - (index + 1) * 1000 * 60 * 14).toISOString(),
    }));
  }
}
```

---

## Template additions

`src/app/features/explore/explore.component.html`

```html
<div class="explore-modal__media-wrap">
  <img
    [src]="item.imageUrl"
    [alt]="item.caption"
    class="explore-modal__media"
    width="920"
    height="920"
  />

  @if (visibleItems.length > 1) {
    <button
      type="button"
      class="explore-modal__nav-btn explore-modal__nav-btn--prev"
      aria-label="Previous post"
      (click)="showPreviousItem()"
    >
      &#10094;
    </button>
    <button
      type="button"
      class="explore-modal__nav-btn explore-modal__nav-btn--next"
      aria-label="Next post"
      (click)="showNextItem()"
    >
      &#10095;
    </button>
  }

  <button
    type="button"
    class="explore-modal__like-fab"
    [class.explore-modal__like-fab--active]="isModalItemLiked(item.id)"
    aria-label="Toggle like"
    (click)="toggleModalLike()"
  >
    <lucide-icon [img]="Heart" [size]="18"></lucide-icon>
  </button>

  <div class="explore-modal__heart-burst" [class.explore-modal__heart-burst--active]="likeBurstActive()" aria-hidden="true">
    <lucide-icon [img]="Heart" [size]="74" [strokeWidth]="2.2"></lucide-icon>
  </div>
</div>

<div class="explore-modal__stats">
  <span>
    <lucide-icon [img]="Heart" [size]="16"></lucide-icon>
    {{ formatCount(modalLikesCount(item)) }}
  </span>
  <span>
    <lucide-icon [img]="MessageCircle" [size]="16"></lucide-icon>
    {{ formatCount(item.commentsCount + modalComments().length) }}
  </span>
</div>
```

---

## Style additions

`src/app/features/explore/explore.component.scss`

```scss
.explore-modal__media-wrap {
  position: relative;
  background: #000;
  min-height: 0;
}

.explore-modal__nav-btn {
  all: unset;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgb(0 0 0 / 45%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;

  &--prev {
    left: $space-3;
  }

  &--next {
    right: $space-3;
  }

  &:hover {
    background: rgb(0 0 0 / 60%);
  }
}

.explore-modal__like-fab {
  all: unset;
  position: absolute;
  right: $space-3;
  bottom: $space-3;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: rgb(0 0 0 / 45%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;

  &:hover {
    background: rgb(0 0 0 / 60%);
  }

  &--active {
    color: $error;
  }
}

.explore-modal__heart-burst {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $error;
  z-index: 2;
  opacity: 0;
  transform: scale(0.35);
  pointer-events: none;

  &--active {
    animation: explore-heart-burst 0.42s ease-out;
  }
}

@keyframes explore-heart-burst {
  0% {
    opacity: 0;
    transform: scale(0.35);
  }

  20% {
    opacity: 1;
    transform: scale(1.05);
  }

  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
```

---

## Verify

```bash
ng build
ng serve
```

Manual checks:

1. Open `/explore` and click any tile to open modal.
2. Confirm page body does not scroll while modal is open.
3. Press left/right arrow keys to move to previous/next item.
4. Click heart button in modal and verify burst animation.
5. Check like count updates immediately in modal stats.
6. Confirm close works via backdrop, close button, and `Esc` key.
