import { Component, inject } from '@angular/core';
import { users } from '../../../assets/data/users';
import { suggestions } from '../../../assets/data/suggestions';
import { stories } from '../../../assets/data/stories';
import type { Story } from '../../../assets/data/stories';
import { StoryViewerService } from '../../core/story-viewer.service';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent {
  private viewerService = inject(StoryViewerService);

  currentUser = users[4];
  suggestionsList = suggestions;

  getUserById(id: string) {
    return users.find((u) => u.id === id) ?? null;
  }

  get yourStory(): Story | null {
    const my = stories.find((s) => s.userId === this.currentUser.id);
    return my ?? null;
  }

  openYourStory(): void {
    this.viewerService.openYourStory(this.currentUser, this.yourStory);
  }
}
