# Phase 7 – Direct Messages (Instagram-style DM inbox & chat)

## Goal

Build a full-featured **Direct Messages** page that faithfully replicates the Instagram DM experience:

- **Left panel** — inbox with username header, search bar, Notes strip, Messages / Requests tabs, and a conversation list (display names, "You:" preview prefix, blue unread dot).
- **Right panel** — either a selected chat (header, message bubbles, input) or the Instagram empty state (circled Send icon, "Your messages" heading, blue "Send message" button).

## What you will learn

| Concept | Where it appears |
|---------|-----------------|
| **Angular signals** (`signal`, `computed`) | Reactive state for conversations, messages, search query |
| **Filtered computed signals** | `filteredConversations` reacts to `searchQuery` in real-time |
| **Complex template control flow** | `@for`, `@if`, `@let` to build dynamic inbox + chat |
| **BEM SCSS** | Thoroughly styled two-panel layout with notes, tabs, bubbles |
| **Mock data modelling** | Conversations, Messages, Notes — related by IDs |
| **Icon management** | 7 new Lucide icons registered centrally |

---

## Files created / modified

| # | File | Action |
|---|------|--------|
| 1 | `src/assets/data/conversations.ts` | **Create** |
| 2 | `src/assets/data/messages.ts` | **Create** |
| 3 | `src/assets/data/notes.ts` | **Create** |
| 4 | `src/assets/data/index.ts` | **Modify** – export new data |
| 5 | `src/app/core/icons.ts` | **Modify** – add 7 new icons |
| 6 | `src/app/features/messages/messages.component.ts` | **Create** |
| 7 | `src/app/features/messages/messages.component.html` | **Create** |
| 8 | `src/app/features/messages/messages.component.scss` | **Create** |
| 9 | `src/app/app.routes.ts` | **Modify** – `/messages` route |

---

## Step-by-step

### 1. Mock data — `src/assets/data/conversations.ts`

The `Conversation` interface tracks participants, the last message, who sent it, and unread count.

```ts
/**
 * Mock conversations for the current user (userId 'u5').
 */

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageSenderId: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    participantIds: ['u5', 'u1'],
    lastMessage: 'Hey! Have you tried the new Angular signals?',
    lastMessageSenderId: 'u1',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'conv2',
    participantIds: ['u5', 'u2'],
    lastMessage: 'Great tutorial! When is the next one?',
    lastMessageSenderId: 'u5',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'conv3',
    participantIds: ['u5', 'u3'],
    lastMessage: 'Thanks for the follow! 🎉',
    lastMessageSenderId: 'u3',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'conv4',
    participantIds: ['u5', 'u4'],
    lastMessage: 'See you at the meetup!',
    lastMessageSenderId: 'u4',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unreadCount: 0,
  },
];
```

### 2. Mock data — `src/assets/data/messages.ts`

Individual chat messages linked to conversations by `conversationId`.

```ts
/**
 * Mock messages for conversations.
 */

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  seen: boolean;
}

export const messages: Message[] = [
  // conv1 – u5 <-> u1 (angular_dev)
  {
    id: 'm1',
    conversationId: 'conv1',
    senderId: 'u1',
    text: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    seen: true,
  },
  {
    id: 'm2',
    conversationId: 'conv1',
    senderId: 'u5',
    text: "I'm good! Working on the Instagram clone.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    seen: true,
  },
  {
    id: 'm3',
    conversationId: 'conv1',
    senderId: 'u1',
    text: 'Nice! Angular 19 is awesome for that.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    seen: true,
  },
  {
    id: 'm4',
    conversationId: 'conv1',
    senderId: 'u1',
    text: 'Hey! Have you tried the new Angular signals?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    seen: false,
  },

  // conv2 – u5 <-> u2 (web_teacher)
  {
    id: 'm5',
    conversationId: 'conv2',
    senderId: 'u2',
    text: 'Your last video was really helpful.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    seen: true,
  },
  {
    id: 'm6',
    conversationId: 'conv2',
    senderId: 'u5',
    text: 'Thanks! Working on the next one now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    seen: true,
  },
  {
    id: 'm7',
    conversationId: 'conv2',
    senderId: 'u5',
    text: 'Great tutorial! When is the next one?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    seen: true,
  },

  // conv3 – u5 <-> u3 (frontend_fan)
  {
    id: 'm8',
    conversationId: 'conv3',
    senderId: 'u3',
    text: 'Hey! Just followed you.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    seen: true,
  },
  {
    id: 'm9',
    conversationId: 'conv3',
    senderId: 'u5',
    text: 'Welcome! Great to connect.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(),
    seen: true,
  },
  {
    id: 'm10',
    conversationId: 'conv3',
    senderId: 'u3',
    text: 'Thanks for the follow! 🎉',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    seen: false,
  },

  // conv4 – u5 <-> u4 (code_explorer)
  {
    id: 'm11',
    conversationId: 'conv4',
    senderId: 'u4',
    text: 'Are you going to the Angular meetup?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    seen: true,
  },
  {
    id: 'm12',
    conversationId: 'conv4',
    senderId: 'u5',
    text: 'Yes! Looking forward to it.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    seen: true,
  },
  {
    id: 'm13',
    conversationId: 'conv4',
    senderId: 'u4',
    text: 'See you at the meetup!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    seen: true,
  },
];
```

### 3. Mock data — `src/assets/data/notes.ts`

Notes are short status messages that appear in the horizontal strip above conversations (like Instagram Notes).

```ts
/**
 * Mock notes for the messages page note bubbles.
 * Notes are short status messages that appear above user avatars.
 */

export interface Note {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export const notes: Note[] = [
  {
    id: 'note1',
    userId: 'u5',
    text: 'Ask friends anything...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'note2',
    userId: 'u1',
    text: 'Learning Angular signals 💪',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'note3',
    userId: 'u2',
    text: 'New tutorial coming soon!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'note4',
    userId: 'u3',
    text: 'Frontend is 🔥',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];
```

### 4. Update barrel export — `src/assets/data/index.ts`

```ts
/**
 * Central export for all mock data – import from assets/data.
 */

export { users, type User } from './users';
export { stories, type Story } from './stories';
export { posts, type Post } from './posts';
export { comments, type Comment } from './comments';
export { suggestions, type Suggestion } from './suggestions';
export { notifications, type Notification, type NotificationType } from './notifications';
export { conversations, type Conversation } from './conversations';
export { messages, type Message } from './messages';
export { notes, type Note } from './notes';
```

### 5. Register new icons — `src/app/core/icons.ts`

Seven new icons for the messaging UI (`PenSquare`, `Info`, `Phone`, `Video`, `Image`, `Smile`, `ChevronDown`).

```ts
/**
 * Central registry of Lucide icons used in the app.
 * Import icons from this file in components so we can track usage in one place.
 *
 * Usage in component:
 *   import { LucideAngularModule } from 'lucide-angular';
 *   import { Heart, MessageCircle } from './core/icons';
 *   // Expose on class: readonly Heart = Heart;
 *   // Template: <lucide-icon [img]="Heart" [size]="24"></lucide-icon>
 */

export {
  // Post / feed
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
  // Left sidebar (nav + logo)
  Camera,
  Home,
  Clapperboard,
  Search,
  Compass,
  SquarePlus,
  User,
  // Stories (strip + viewer)
  ChevronLeft,
  ChevronRight,
  X,
  CheckCheck,
  // Messages
  PenSquare,
  Info,
  Phone,
  Video,
  Image,
  Smile,
  ChevronDown,
} from 'lucide-angular';

/** List of icon names in use – for documentation and tracking. */
export const ICONS_IN_USE = [
  'Heart',
  'MessageCircle',
  'Send',
  'Bookmark',
  'MoreHorizontal',
  'BadgeCheck',
  'Camera',
  'Home',
  'Clapperboard',
  'Search',
  'Compass',
  'SquarePlus',
  'User',
  'ChevronLeft',
  'ChevronRight',
  'X',
  'CheckCheck',
  'PenSquare',
  'Info',
  'Phone',
  'Video',
  'Image',
  'Smile',
  'ChevronDown',
] as const;
```

### 6. Messages component — TypeScript (`src/app/features/messages/messages.component.ts`)

Central logic: signals for state, computed signals for derived data, helper methods for template.

```ts
import { Component, signal, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  PenSquare, Info, Phone, Video, Image, Smile, Send, Search, ChevronDown, ChevronRight,
} from '../../core/icons';
import { conversations } from '../../../assets/data/conversations';
import { messages as allMessages } from '../../../assets/data/messages';
import { users } from '../../../assets/data/users';
import { notes } from '../../../assets/data/notes';
import type { Conversation } from '../../../assets/data';
import type { Message } from '../../../assets/data';
import type { User } from '../../../assets/data';
import type { Note } from '../../../assets/data';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  /* Icons */
  readonly PenSquare = PenSquare;
  readonly Info = Info;
  readonly Phone = Phone;
  readonly Video = Video;
  readonly ImageIcon = Image;
  readonly Smile = Smile;
  readonly Send = Send;
  readonly Search = Search;
  readonly ChevronDown = ChevronDown;
  readonly ChevronRight = ChevronRight;

  /* Current user */
  readonly currentUser = users.find((u) => u.id === 'u5')!;

  /* Notes */
  readonly notes = notes;

  /* State */
  readonly conversations = signal<Conversation[]>([...conversations]);
  readonly selectedConversationId = signal<string | null>(null);
  readonly messageText = signal('');
  readonly searchQuery = signal('');
  private readonly _messages = signal<Message[]>([...allMessages]);

  /* Computed */
  readonly selectedConversation = computed(() => {
    const id = this.selectedConversationId();
    return this.conversations().find((c) => c.id === id) ?? null;
  });

  readonly chatPartner = computed((): User | null => {
    const conv = this.selectedConversation();
    if (!conv) return null;
    const partnerId = conv.participantIds.find((id) => id !== 'u5');
    return users.find((u) => u.id === partnerId) ?? null;
  });

  readonly chatMessages = computed((): Message[] => {
    const id = this.selectedConversationId();
    if (!id) return [];
    return this._messages().filter((m) => m.conversationId === id);
  });

  readonly filteredConversations = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const convs = this.conversations();
    if (!q) return convs;
    return convs.filter((conv) => {
      const partner = this.getPartner(conv);
      if (!partner) return false;
      return (
        partner.username.toLowerCase().includes(q) ||
        partner.displayName.toLowerCase().includes(q)
      );
    });
  });

  /* Helpers */
  getPartner(conv: Conversation): User | undefined {
    const partnerId = conv.participantIds.find((id) => id !== 'u5');
    return users.find((u) => u.id === partnerId);
  }

  getUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  getNoteUser(note: Note): User | undefined {
    return users.find((u) => u.id === note.userId);
  }

  isCurrentUserNote(note: Note): boolean {
    return note.userId === 'u5';
  }

  getPreviewText(conv: Conversation): string {
    const isOwn = conv.lastMessageSenderId === 'u5';
    const prefix = isOwn ? 'You: ' : '';
    return `${prefix}${conv.lastMessage}`;
  }

  relativeTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (sec < 60) return 'Just now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
    if (sec < 604800) return `${Math.floor(sec / 86400)}d`;
    return d.toLocaleDateString();
  }

  formatMessageTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  isOwnMessage(msg: Message): boolean {
    return msg.senderId === 'u5';
  }

  /* Actions */
  selectConversation(convId: string): void {
    this.selectedConversationId.set(convId);
    /* Mark conversation as read */
    this.conversations.update((list) =>
      list.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.messageText.set(input.value);
  }

  sendMessage(): void {
    const text = this.messageText().trim();
    const convId = this.selectedConversationId();
    if (!text || !convId) return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      conversationId: convId,
      senderId: 'u5',
      text,
      timestamp: new Date().toISOString(),
      seen: false,
    };

    this._messages.update((msgs) => [...msgs, newMsg]);

    /* Update last message in conversation */
    this.conversations.update((list) =>
      list.map((c) =>
        c.id === convId
          ? { ...c, lastMessage: text, lastMessageSenderId: 'u5', lastMessageTime: newMsg.timestamp }
          : c
      )
    );

    this.messageText.set('');
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
```

> **Key patterns to note:**
>
> - `selectedConversationId` defaults to `null` — no conversation selected initially, matching Instagram's empty state.
> - `filteredConversations` is a `computed` that re-evaluates whenever `searchQuery` or `conversations` change.
> - `getPreviewText()` prepends "You: " when the current user sent the last message.
> - `lastMessageSenderId` on `Conversation` tells us who sent the latest message.

### 7. Messages component — Template (`src/app/features/messages/messages.component.html`)

Two-panel layout: inbox on the left, chat (or empty state) on the right.

```html
<div class="messages">
  <!-- Left: Conversation List -->
  <aside class="messages__inbox">
    <!-- Header: username + new message -->
    <header class="messages__inbox-header">
      <button type="button" class="messages__inbox-user" aria-label="Switch account">
        <span class="messages__inbox-username">{{ currentUser.username }}</span>
        <lucide-icon [img]="ChevronDown" [size]="16"></lucide-icon>
      </button>
      <button type="button" class="messages__new-btn" aria-label="New message">
        <lucide-icon [img]="PenSquare" [size]="24"></lucide-icon>
      </button>
    </header>

    <!-- Search -->
    <div class="messages__search">
      <div class="messages__search-wrap">
        <lucide-icon [img]="Search" [size]="16" class="messages__search-icon"></lucide-icon>
        <input
          type="text"
          class="messages__search-input"
          placeholder="Search"
          [value]="searchQuery()"
          (input)="onSearchInput($event)"
        />
      </div>
    </div>

    <!-- Notes strip -->
    <div class="messages__notes">
      <div class="messages__notes-scroll">
        @for (note of notes; track note.id) {
          @let noteUser = getNoteUser(note);
          @if (noteUser) {
            <div class="messages__note-item">
              <div class="messages__note-bubble">
                <span class="messages__note-text">{{ note.text }}</span>
              </div>
              <img
                [src]="noteUser.avatarUrl"
                [alt]="noteUser.displayName"
                class="messages__note-avatar"
                width="64"
                height="64"
              />
              <span class="messages__note-name">
                {{ isCurrentUserNote(note) ? 'Your note' : noteUser.username }}
              </span>
            </div>
          }
        }
      </div>
    </div>

    <!-- Messages / Requests tabs -->
    <div class="messages__tabs">
      <button type="button" class="messages__tab messages__tab--active">Messages</button>
      <button type="button" class="messages__tab">Requests</button>
    </div>

    <!-- Conversation list -->
    <ul class="messages__conv-list">
      @for (conv of filteredConversations(); track conv.id) {
        @let partner = getPartner(conv);
        @if (partner) {
          <li class="messages__conv-item">
            <button
              type="button"
              class="messages__conv-row"
              [class.messages__conv-row--active]="conv.id === selectedConversationId()"
              (click)="selectConversation(conv.id)"
            >
              <img
                [src]="partner.avatarUrl"
                [alt]="partner.displayName"
                class="messages__conv-avatar"
                width="56"
                height="56"
              />
              <div class="messages__conv-info">
                <span class="messages__conv-name">{{ partner.displayName }}</span>
                <span
                  class="messages__conv-preview"
                  [class.messages__conv-preview--unread]="conv.unreadCount > 0"
                >
                  {{ getPreviewText(conv) }} · {{ relativeTime(conv.lastMessageTime) }}
                </span>
              </div>
              @if (conv.unreadCount > 0) {
                <span class="messages__conv-dot"></span>
              }
            </button>
          </li>
        }
      }
    </ul>
  </aside>

  <!-- Right: Chat View -->
  <section class="messages__chat">
    @if (selectedConversation(); as conv) {
      @let partner = chatPartner();

      <!-- Chat Header -->
      <header class="messages__chat-header">
        @if (partner) {
          <div class="messages__chat-user">
            <img
              [src]="partner.avatarUrl"
              [alt]="partner.displayName"
              class="messages__chat-avatar"
              width="44"
              height="44"
            />
            <div class="messages__chat-user-info">
              <span class="messages__chat-username">{{ partner.displayName }}</span>
              <span class="messages__chat-status">Active now</span>
            </div>
          </div>
          <div class="messages__chat-actions">
            <button type="button" class="messages__chat-action" aria-label="Voice call">
              <lucide-icon [img]="Phone" [size]="24"></lucide-icon>
            </button>
            <button type="button" class="messages__chat-action" aria-label="Video call">
              <lucide-icon [img]="Video" [size]="24"></lucide-icon>
            </button>
            <button type="button" class="messages__chat-action" aria-label="Conversation info">
              <lucide-icon [img]="Info" [size]="24"></lucide-icon>
            </button>
          </div>
        }
      </header>

      <!-- Chat Messages -->
      <div class="messages__chat-body">
        @if (partner) {
          <div class="messages__chat-intro">
            <img
              [src]="partner.avatarUrl"
              [alt]="partner.displayName"
              class="messages__chat-intro-avatar"
              width="96"
              height="96"
            />
            <span class="messages__chat-intro-name">{{ partner.displayName }}</span>
            <span class="messages__chat-intro-handle">{{ partner.username }}</span>
          </div>
        }

        @for (msg of chatMessages(); track msg.id) {
          <div
            class="messages__bubble-wrap"
            [class.messages__bubble-wrap--own]="isOwnMessage(msg)"
          >
            <div
              class="messages__bubble"
              [class.messages__bubble--own]="isOwnMessage(msg)"
            >
              {{ msg.text }}
            </div>
            <time class="messages__bubble-time" [attr.datetime]="msg.timestamp">
              {{ formatMessageTime(msg.timestamp) }}
            </time>
          </div>
        }
      </div>

      <!-- Chat Input -->
      <footer class="messages__chat-footer">
        <div class="messages__input-wrap">
          <button type="button" class="messages__input-action" aria-label="Emoji">
            <lucide-icon [img]="Smile" [size]="24"></lucide-icon>
          </button>
          <input
            type="text"
            class="messages__input"
            placeholder="Message..."
            [value]="messageText()"
            (input)="onInputChange($event)"
            (keydown)="onKeydown($event)"
          />
          @if (messageText().trim()) {
            <button type="button" class="messages__send-btn" (click)="sendMessage()">
              Send
            </button>
          } @else {
            <button type="button" class="messages__input-action" aria-label="Send photo">
              <lucide-icon [img]="ImageIcon" [size]="24"></lucide-icon>
            </button>
          }
        </div>
      </footer>
    } @else {
      <!-- Empty state matching Instagram -->
      <div class="messages__empty">
        <div class="messages__empty-icon">
          <lucide-icon [img]="Send" [size]="44"></lucide-icon>
        </div>
        <h3 class="messages__empty-title">Your messages</h3>
        <p class="messages__empty-text">Send a message to start a chat.</p>
        <button type="button" class="messages__empty-btn">Send message</button>
      </div>
    }
  </section>
</div>
```

> **Template highlights:**
>
> - **Notes strip** uses `@for` + `@let` + `@if` to safely render each note bubble with user lookup.
> - **"Your note"** label on the current user's note, other users show their username.
> - **Blue dot** (`messages__conv-dot`) instead of a number badge for unread conversations.
> - **"You: "** prefix in message previews when the current user sent the last message.
> - **Empty state** shows a circled Send icon + "Send message" button when nothing is selected.

### 8. Messages component — Styles (`src/app/features/messages/messages.component.scss`)

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;

.messages {
  display: flex;
  width: 100%;
  height: 100vh;
  background: $bg-primary;
}

/* ============================================
   Left panel – inbox
   ============================================ */
.messages__inbox {
  width: 400px;
  min-width: 400px;
  border-right: 1px solid $border-primary;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.messages__inbox-header {
  @include flex-between;
  padding: $space-4 $space-5 $space-2;
  flex-shrink: 0;
}

.messages__inbox-user {
  display: flex;
  align-items: center;
  gap: $space-1;
  background: none;
  border: none;
  color: $text-primary;
  cursor: pointer;
  padding: 0;
}

.messages__inbox-username {
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.messages__new-btn {
  background: none;
  border: none;
  color: $text-primary;
  padding: $space-2;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    opacity: 0.7;
  }
}

/* Search */
.messages__search {
  padding: $space-2 $space-4;
  flex-shrink: 0;
}

.messages__search-wrap {
  display: flex;
  align-items: center;
  gap: $space-3;
  background: $bg-elevated;
  border-radius: 8px;
  padding: $space-2 $space-4;
}

.messages__search-icon {
  color: $text-muted;
  flex-shrink: 0;
}

.messages__search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: $text-primary;
  font-size: $font-size-base;
  font-family: $font-family;

  &::placeholder {
    color: $text-muted;
  }
}

/* Notes strip */
.messages__notes {
  flex-shrink: 0;
  border-bottom: 1px solid $border-primary;
}

.messages__notes-scroll {
  display: flex;
  gap: $space-3;
  padding: $space-3 $space-4;
  overflow-x: auto;
  @include hide-scrollbar;
}

.messages__note-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  min-width: 80px;
  max-width: 80px;
  cursor: pointer;
  position: relative;
}

.messages__note-bubble {
  background: $bg-elevated;
  border: 1px solid $border-secondary;
  border-radius: 16px 16px 16px 4px;
  padding: 4px 8px;
  max-width: 76px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.messages__note-text {
  font-size: 11px;
  color: $text-primary;
  @include truncate;
  max-width: 64px;
  line-height: 1.3;
  text-align: center;
}

.messages__note-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: -4px;
}

.messages__note-name {
  font-size: $font-size-xs;
  color: $text-secondary;
  @include truncate;
  max-width: 76px;
  text-align: center;
}

/* Tabs (Messages / Requests) */
.messages__tabs {
  @include flex-between;
  padding: 0 $space-5;
  flex-shrink: 0;
}

.messages__tab {
  flex: 1;
  background: none;
  border: none;
  color: $text-muted;
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  padding: $space-3 0;
  cursor: pointer;
  text-align: center;
  position: relative;

  &--active {
    color: $text-primary;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: $text-primary;
    }
  }

  &:hover:not(.messages__tab--active) {
    color: $text-secondary;
  }
}

/* Conversation list */
.messages__conv-list {
  list-style: none;
  margin: 0;
  padding: $space-2 0;
  flex: 1;
  overflow-y: auto;
  @include hide-scrollbar;
}

.messages__conv-item {
  margin: 0;
}

.messages__conv-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-2 $space-5;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  text-align: left;
  min-width: 0;
  min-height: 72px;

  &:hover {
    background: $bg-hover;
  }

  &--active {
    background: $bg-tertiary;
  }
}

.messages__conv-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.messages__conv-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.messages__conv-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-normal;
  color: $text-primary;
  @include truncate;
}

.messages__conv-preview {
  font-size: $font-size-sm;
  color: $text-muted;
  @include truncate;

  &--unread {
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
}

.messages__conv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $accent;
  flex-shrink: 0;
}

/* ============================================
   Right panel – chat view
   ============================================ */
.messages__chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Chat header */
.messages__chat-header {
  @include flex-between;
  padding: $space-3 $space-5;
  border-bottom: 1px solid $border-primary;
  flex-shrink: 0;
}

.messages__chat-user {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.messages__chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.messages__chat-user-info {
  display: flex;
  flex-direction: column;
}

.messages__chat-username {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.messages__chat-status {
  font-size: $font-size-xs;
  color: $text-muted;
}

.messages__chat-actions {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.messages__chat-action {
  background: none;
  border: none;
  color: $text-primary;
  padding: $space-2;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    opacity: 0.7;
  }
}

/* Chat body */
.messages__chat-body {
  flex: 1;
  overflow-y: auto;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  @include hide-scrollbar;
}

.messages__chat-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-2;
  padding: $space-6 0 $space-8;
}

.messages__chat-intro-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
}

.messages__chat-intro-name {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.messages__chat-intro-handle {
  font-size: $font-size-sm;
  color: $text-muted;
}

/* Bubble */
.messages__bubble-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 65%;

  &--own {
    align-self: flex-end;
    align-items: flex-end;
  }
}

.messages__bubble {
  padding: $space-3 $space-4;
  border-radius: 22px;
  font-size: $font-size-sm;
  line-height: 1.4;
  color: $text-primary;
  background: $bg-elevated;
  word-break: break-word;

  &--own {
    background: $accent;
    color: #fff;
  }
}

.messages__bubble-time {
  font-size: 10px;
  color: $text-muted;
  margin-top: 2px;
  padding: 0 $space-2;
}

/* Chat footer */
.messages__chat-footer {
  padding: $space-3 $space-5;
  border-top: 1px solid $border-primary;
  flex-shrink: 0;
}

.messages__input-wrap {
  display: flex;
  align-items: center;
  gap: $space-3;
  background: $bg-tertiary;
  border: 1px solid $border-secondary;
  border-radius: 22px;
  padding: $space-2 $space-4;
}

.messages__input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: $text-primary;
  font-size: $font-size-sm;
  font-family: $font-family;

  &::placeholder {
    color: $text-muted;
  }
}

.messages__input-action {
  background: none;
  border: none;
  color: $text-secondary;
  padding: $space-1;
  cursor: pointer;
  @include flex-center;

  &:hover {
    color: $text-primary;
  }
}

.messages__send-btn {
  background: none;
  border: none;
  color: $accent;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  cursor: pointer;
  padding: $space-1 $space-2;

  &:hover {
    color: $accent-hover;
  }
}

/* Empty state (matches Instagram) */
.messages__empty {
  flex: 1;
  @include flex-center;
  flex-direction: column;
  gap: $space-3;
}

.messages__empty-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 2px solid $text-primary;
  @include flex-center;
  color: $text-primary;
}

.messages__empty-title {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-normal;
  color: $text-primary;
}

.messages__empty-text {
  margin: 0;
  font-size: $font-size-sm;
  color: $text-muted;
}

.messages__empty-btn {
  margin-top: $space-2;
  padding: $space-2 $space-4;
  background: $accent;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  cursor: pointer;

  &:hover {
    background: $accent-hover;
  }
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 900px) {
  .messages__inbox {
    width: 320px;
    min-width: 320px;
  }
}

@media (max-width: 768px) {
  .messages__inbox {
    width: 80px;
    min-width: 80px;
  }

  .messages__inbox-header {
    justify-content: center;
    padding: $space-3;
  }

  .messages__inbox-user,
  .messages__search,
  .messages__notes,
  .messages__tabs {
    display: none;
  }

  .messages__conv-row {
    justify-content: center;
    padding: $space-2;
  }

  .messages__conv-info,
  .messages__conv-dot {
    display: none;
  }

  .messages__conv-avatar {
    width: 48px;
    height: 48px;
  }
}
```

### 9. Route — `src/app/app.routes.ts`

```ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';
import { MessagesComponent } from './features/messages/messages.component';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'search', redirectTo: '', pathMatch: 'full' },
      { path: 'notifications', redirectTo: '', pathMatch: 'full' },
      { path: 'explore', component: PlaceholderComponent, data: { pageName: 'Explore' } },
      { path: 'reels', component: PlaceholderComponent, data: { pageName: 'Reels' } },
      { path: 'messages', component: MessagesComponent },
      { path: 'create', component: PlaceholderComponent, data: { pageName: 'Create' } },
      { path: 'profile', component: PlaceholderComponent, data: { pageName: 'Profile' } },
    ],
  },
  { path: '**', redirectTo: '' },
];
```

---

## Instagram UI features replicated

| Feature | Implementation |
|---------|---------------|
| Username + chevron dropdown | Header button with `ChevronDown` icon |
| Search bar | Text input with `Search` icon in elevated background |
| Notes strip | Horizontal scroll of note bubbles + avatars; "Your note" for current user |
| Messages / Requests tabs | Two-button tab bar with active underline |
| Display name in conversation list | `partner.displayName` (bold) instead of username |
| "You: " preview prefix | `getPreviewText()` checks `lastMessageSenderId` |
| Blue unread dot | 8px accent circle instead of number badge |
| Empty state | Circled Send icon + "Your messages" + blue "Send message" button |
| Chat header | Avatar, display name, "Active now", phone/video/info actions |
| Chat bubbles | Rounded, accent-colored for own messages, elevated bg for others |
| Message input | Pill-shaped, emoji/image icons, send button appears on input |

---

## Verify

```bash
ng build        # ✅ No errors
ng serve        # Navigate to /messages
```

Navigate to `/messages` and confirm:
1. Empty state shows on load (no conversation selected)
2. Notes strip scrolls horizontally
3. Search filters conversations in real-time
4. Clicking a conversation opens the chat
5. Sending a message updates both the chat and last-message preview
6. Blue dot disappears when a conversation is opened
