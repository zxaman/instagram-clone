import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Heart, MessageCircle, Send, MoreHorizontal, ChevronUp, ChevronDown } from '../../core/icons';
import { reels as reelsData } from '../../../assets/data/reels';
import type { Reel } from '../../../assets/data/reels';
import { users } from '../../../assets/data/users';
import type { User } from '../../../assets/data';

type ReelWithUser = Reel & { user: User | null };

@Component({
  selector: 'app-reels',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './reels.component.html',
  styleUrl: './reels.component.scss',
  host: {
    '(window:keydown)': 'onWindowKeydown($event)',
  },
})
export class ReelsComponent {
  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  readonly MoreHorizontal = MoreHorizontal;
  readonly ChevronUp = ChevronUp;
  readonly ChevronDown = ChevronDown;

  readonly activeTab = signal<'for-you' | 'following'>('for-you');
  readonly reels = signal<Reel[]>([...reelsData]);
  readonly activeIndex = signal(0);

  @ViewChild('reelsList') private reelsListRef?: ElementRef<HTMLDivElement>;
  private wheelLocked = false;

  readonly reelsWithUsers = computed<ReelWithUser[]>(() =>
    this.reels().map((reel) => ({
      ...reel,
      user: this.getUserById(reel.userId) ?? null,
    }))
  );

  setTab(tab: 'for-you' | 'following'): void {
    this.activeTab.set(tab);
  }

  prevReel(): void {
    const current = this.activeIndex();
    this.scrollToIndex(current - 1);
  }

  nextReel(): void {
    const current = this.activeIndex();
    this.scrollToIndex(current + 1);
  }

  onListScroll(): void {
    const list = this.reelsListRef?.nativeElement;
    if (!list) return;

    const snapItems = list.querySelectorAll<HTMLElement>('.reels__snap');
    if (!snapItems.length) return;

    const listTop = list.scrollTop;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    snapItems.forEach((item, index) => {
      const distance = Math.abs(item.offsetTop - listTop);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    this.activeIndex.set(nearestIndex);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (this.wheelLocked) return;

    this.wheelLocked = true;
    if (event.deltaY > 0) {
      this.nextReel();
    } else if (event.deltaY < 0) {
      this.prevReel();
    }

    setTimeout(() => {
      this.wheelLocked = false;
    }, 280);
  }

  onWindowKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target) {
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
    }

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      this.nextReel();
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      this.prevReel();
    }
  }

  toggleLike(reelId: string): void {
    this.reels.update((list) =>
      list.map((reel) => {
        if (reel.id !== reelId) {
          return reel;
        }

        const currentlyLiked = reel.isLiked ?? false;
        return {
          ...reel,
          isLiked: !currentlyLiked,
          likesCount: currentlyLiked ? reel.likesCount - 1 : reel.likesCount + 1,
        };
      })
    );
  }

  relativeTime(iso: string): string {
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diffSec < 60) return 'now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d`;
    return `${Math.floor(diffSec / 604800)}w`;
  }

  private getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  private scrollToIndex(index: number): void {
    const list = this.reelsListRef?.nativeElement;
    if (!list) return;

    const snapItems = list.querySelectorAll<HTMLElement>('.reels__snap');
    if (!snapItems.length) return;

    const clampedIndex = Math.max(0, Math.min(index, snapItems.length - 1));
    const target = snapItems.item(clampedIndex);
    if (!target) return;

    this.activeIndex.set(clampedIndex);
    list.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  }
}
