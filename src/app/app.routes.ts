import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'search', redirectTo: '', pathMatch: 'full' },
      { path: 'explore', component: PlaceholderComponent, data: { pageName: 'Explore' } },
      { path: 'reels', component: PlaceholderComponent, data: { pageName: 'Reels' } },
      { path: 'messages', component: PlaceholderComponent, data: { pageName: 'Messages' } },
      { path: 'notifications', component: PlaceholderComponent, data: { pageName: 'Notifications' } },
      { path: 'create', component: PlaceholderComponent, data: { pageName: 'Create' } },
      { path: 'profile', component: PlaceholderComponent, data: { pageName: 'Profile' } },
    ],
  },
  { path: '**', redirectTo: '' },
];
