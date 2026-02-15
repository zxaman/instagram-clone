import { Injectable, signal, computed } from '@angular/core';
import { users } from '../../assets/data/users';
import type { User } from '../../assets/data';

@Injectable({ providedIn: 'root' })
export class SearchSidebarService {
  private readonly _isOpen = signal(false);
  private readonly _recentUserIds = signal<string[]>([]);

  readonly isOpen = this._isOpen.asReadonly();
  readonly recentUserIds = this._recentUserIds.asReadonly();

  /** Recent users in display order (newest first). */
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
