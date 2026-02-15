import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SearchSidebarService } from '../../core/search-sidebar.service';
import { NotificationsSidebarService } from '../../core/notifications-sidebar.service';
import {
  Home,
  Clapperboard,
  MessageCircle,
  Search,
  Compass,
  Heart,
  SquarePlus,
  User,
  Camera,
} from '../../core/icons';

interface NavItem {
  label: string;
  path: string;
  icon: typeof Home;
}

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss',
})
export class LeftSidebarComponent {
  readonly Camera = Camera;
  private searchSidebar = inject(SearchSidebarService);
  private notificationsSidebar = inject(NotificationsSidebarService);

  navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Reels', path: '/reels', icon: Clapperboard },
    { label: 'Messages', path: '/messages', icon: MessageCircle },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Notifications', path: '/notifications', icon: Heart },
    { label: 'Create', path: '/create', icon: SquarePlus },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  onNavClick(event: Event, item: NavItem): void {
    if (item.path === '/search') {
      event.preventDefault();
      this.searchSidebar.open();
    } else if (item.path === '/notifications') {
      event.preventDefault();
      this.notificationsSidebar.open();
    }
  }
}
