import { Component } from '@angular/core';
import { users } from '../../../assets/data/users';
import { suggestions } from '../../../assets/data/suggestions';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent {
  currentUser = users[4];
  suggestionsList = suggestions;

  getUserById(id: string) {
    return users.find((u) => u.id === id) ?? null;
  }
}
