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
