import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { SearchSidebarComponent } from '../../features/search/search-sidebar.component';
import { NotificationsSidebarComponent } from '../../features/notifications/notifications-sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    LeftSidebarComponent,
    RightSidebarComponent,
    RouterOutlet,
    SearchSidebarComponent,
    NotificationsSidebarComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly router = inject(Router);

  readonly isImmersiveRoute = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
      map((url) => {
        const [path] = url.split('?');
        return (
          path === '/messages' ||
          path === '/reels' ||
          path === '/profile' ||
          path === '/explore'
        );
      })
    ),
    {
      initialValue:
        this.router.url.split('?')[0] === '/messages' ||
        this.router.url.split('?')[0] === '/reels' ||
        this.router.url.split('?')[0] === '/profile' ||
        this.router.url.split('?')[0] === '/explore',
    }
  );
}
