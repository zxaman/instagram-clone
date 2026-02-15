import { Component, signal, computed, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { X, CheckCheck } from '../../core/icons';
import { NotificationsSidebarService } from '../../core/notifications-sidebar.service';
import { notifications as initialNotifications } from '../../../assets/data/notifications';
import { users } from '../../../assets/data/users';
import type { Notification } from '../../../assets/data';
import type { User } from '../../../assets/data';

@Component({
  selector: 'app-notifications-sidebar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './notifications-sidebar.component.html',
  styleUrl: './notifications-sidebar.component.scss',
})
export class NotificationsSidebarComponent {
  readonly X = X;
  readonly CheckCheck = CheckCheck;

  private notificationsSidebar = inject(NotificationsSidebarService);

  private _list = signal<Notification[]>([]);

  constructor() {
    this._list.set([...initialNotifications]);
  }

  notifications = this._list.asReadonly();
  hasUnread = computed(() => this._list().some((n) => !n.read));

  get isOpen(): boolean {
    return this.notificationsSidebar.isOpen();
  }

  close(): void {
    this.notificationsSidebar.close();
  }

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
