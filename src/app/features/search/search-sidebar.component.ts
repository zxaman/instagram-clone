import { Component, signal, computed, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Search as SearchIcon, X } from '../../core/icons';
import { SearchSidebarService } from '../../core/search-sidebar.service';
import { users } from '../../../assets/data/users';

const CURRENT_USER_ID = 'u5';

@Component({
  selector: 'app-search-sidebar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './search-sidebar.component.html',
  styleUrl: './search-sidebar.component.scss',
})
export class SearchSidebarComponent {
  readonly SearchIcon = SearchIcon;
  readonly X = X;

  private searchSidebar = inject(SearchSidebarService);

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

  get isOpen(): boolean {
    return this.searchSidebar.isOpen();
  }

  /** Expose computed so template stays reactive. */
  recentUsers = this.searchSidebar.recentUsers;

  close(): void {
    this.searchSidebar.close();
  }

  clearQuery(): void {
    this.query.set('');
  }

  addRecent(userId: string): void {
    this.searchSidebar.addRecent(userId);
  }

  removeRecent(userId: string, e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.searchSidebar.removeRecent(userId);
  }

  clearRecent(): void {
    this.searchSidebar.clearRecent();
  }
}
