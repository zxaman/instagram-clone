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
