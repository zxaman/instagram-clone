import { Component, signal, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CheckCheck } from '../../core/icons';
import { notifications as initialNotifications } from '../../../assets/data/notifications';
import { users } from '../../../assets/data/users';
import type { Notification } from '../../../assets/data';
import type { User } from '../../../assets/data';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  readonly CheckCheck = CheckCheck;

  private _list = signal<Notification[]>([]);

  constructor() {
    this._list.set([...initialNotifications]);
  }

  notifications = this._list.asReadonly();

  hasUnread = computed(() => this._list().some((n) => !n.read));

  getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
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

  markAsRead(id: string): void {
    this._list.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllAsRead(): void {
    this._list.update((list) => list.map((n) => ({ ...n, read: true })));
  }
}
