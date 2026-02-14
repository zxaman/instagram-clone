import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss',
})
export class LeftSidebarComponent {
  navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Reels', path: '/reels', icon: 'reels' },
    { label: 'Messages', path: '/messages', icon: 'messages' },
    { label: 'Search', path: '/search', icon: 'search' },
    { label: 'Explore', path: '/explore', icon: 'explore' },
    { label: 'Notifications', path: '/notifications', icon: 'notifications' },
    { label: 'Create', path: '/create', icon: 'create' },
    { label: 'Profile', path: '/profile', icon: 'profile' },
  ];
}
