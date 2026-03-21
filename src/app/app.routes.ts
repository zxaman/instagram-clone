import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';
import { MessagesComponent } from './features/messages/messages.component';
import { ReelsComponent } from './features/reels/reels.component';
import { ProfileComponent } from './features/profile/profile.component';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'search', redirectTo: '', pathMatch: 'full' },
      { path: 'notifications', redirectTo: '', pathMatch: 'full' },
      { path: 'explore', component: PlaceholderComponent, data: { pageName: 'Explore' } },
      { path: 'reels', component: ReelsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'create', component: PlaceholderComponent, data: { pageName: 'Create' } },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
