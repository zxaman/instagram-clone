import { Component } from '@angular/core';
import { StoriesComponent } from '../stories/stories.component';
import { PostComponent } from '../feed/post.component';
import { posts } from '../../../assets/data/posts';
import { comments } from '../../../assets/data/comments';
import { users } from '../../../assets/data/users';
import type { User } from '../../../assets/data';
import type { Comment } from '../../../assets/data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StoriesComponent, PostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  posts = posts;

  getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  /** Bound reference for passing to app-post so comment author lookup works. */
  getUserByIdRef = (id: string): User | undefined => this.getUserById(id);

  getCommentsForPost(postId: string): Comment[] {
    return comments.filter((c) => c.postId === postId);
  }
}
