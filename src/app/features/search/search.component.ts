import { Component, signal, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Search as SearchIcon } from '../../core/icons';
import { users } from '../../../assets/data/users';
const CURRENT_USER_ID = 'u5';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  readonly SearchIcon = SearchIcon;

  query = signal('');

  private searchableUsers = users.filter((u) => u.id !== CURRENT_USER_ID);

  filteredUsers = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    return this.searchableUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q)
    );
  });
}
