import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
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
}
