import { Component, input, signal, effect } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
} from '../../core/icons';
import type { Post, User, Comment } from '../../../assets/data';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  readonly Heart = Heart;
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  readonly Bookmark = Bookmark;
  readonly MoreHorizontal = MoreHorizontal;
  readonly BadgeCheck = BadgeCheck;

  post = input.required<Post>();
  user = input.required<User>();
  comments = input<Comment[]>([]);
  getUserById = input.required<(id: string) => User | undefined>();

  private liked = signal<boolean>(false);
  private likeCount = signal<number>(0);

  constructor() {
    effect(() => {
      const p = this.post();
      if (p) {
        this.liked.set(p.isLiked ?? false);
        this.likeCount.set(p.likesCount ?? 0);
      }
    });
  }

  get isLiked(): boolean {
    return this.liked();
  }

  get likesCount(): number {
    return this.likeCount();
  }

  toggleLike(): void {
    this.liked.update((v) => !v);
    this.likeCount.update((c) => (this.liked() ? c + 1 : Math.max(0, c - 1)));
  }

  relativeTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (sec < 60) return 'Just now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
    if (sec < 2592000) return `${Math.floor(sec / 86400)}d`;
    return d.toLocaleDateString();
  }
}
