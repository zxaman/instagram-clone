import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { SearchSidebarComponent } from '../../features/search/search-sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    LeftSidebarComponent,
    RightSidebarComponent,
    RouterOutlet,
    SearchSidebarComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
