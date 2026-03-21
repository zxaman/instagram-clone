import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Heart, MessageCircle } from '../../core/icons';
import { posts } from '../../../assets/data/posts';
import { users } from '../../../assets/data/users';
import { CreatedPostsService } from '../../core/created-posts.service';
import type { Post } from '../../../assets/data';

const CURRENT_USER_ID = 'u5';

type ProfileTab = 'posts' | 'saved' | 'tagged';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  private readonly createdPosts = inject(CreatedPostsService);

  readonly activeTab = signal<ProfileTab>('posts');

  readonly currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;

  readonly allPosts = computed<Post[]>(() => [
    ...this.createdPosts.feedPosts(),
    ...posts,
  ]);

  readonly userPosts = computed<Post[]>(() => {
    const own = this.allPosts().filter((p) => p.userId === CURRENT_USER_ID);
    return own.length > 0 ? own : this.allPosts();
  });

  readonly savedPosts = computed<Post[]>(() =>
    this.userPosts().filter((p) => p.isSaved)
  );

  readonly taggedPosts = computed<Post[]>(() =>
    this.userPosts().filter((p) => p.commentsCount >= 10)
  );

  readonly postsCount = computed(() => this.userPosts().length);

  readonly visiblePosts = computed<Post[]>(() => {
    const tab = this.activeTab();
    if (tab === 'saved') return this.savedPosts();
    if (tab === 'tagged') return this.taggedPosts();
    return this.userPosts();
  });

  setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  formatCount(value: number): string {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
}
