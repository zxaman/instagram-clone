import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CreateModalService } from '../../core/create-modal.service';
import { CreatedPostsService, type CreatedPost } from '../../core/created-posts.service';

type CreateStep = 'select' | 'crop' | 'details';
type AspectRatio = 'square' | 'portrait' | 'landscape';

type PrivacyOption = 'Public' | 'Followers' | 'Close Friends';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent {
  private readonly createModal = inject(CreateModalService);
  private readonly createdPosts = inject(CreatedPostsService);

  readonly step = signal<CreateStep>('select');
  readonly imageUrl = signal('');
  readonly imageSourceLabel = signal('No media selected');
  readonly aspectRatio = signal<AspectRatio>('portrait');
  readonly caption = signal('');
  readonly location = signal('');
  readonly collaborators = signal('');
  readonly privacy = signal<PrivacyOption>('Public');
  readonly commentsEnabled = signal(true);
  readonly hideLikeCount = signal(false);
  readonly publishedPosts = this.createdPosts.createdPosts;

  readonly privacyOptions: ReadonlyArray<PrivacyOption> = [
    'Public',
    'Followers',
    'Close Friends',
  ];

  readonly captionLimit = 2200;
  readonly selectUrlDraft = signal('');

  readonly captionLength = computed(() => this.caption().trim().length);
  readonly captionRemaining = computed(() => this.captionLimit - this.captionLength());
  readonly canGoNextFromSelect = computed(() => this.imageUrl().trim().length > 0);
  readonly canPublish = computed(() => this.imageUrl().trim().length > 0);
  readonly hasSelectedImage = computed(() => this.imageUrl().trim().length > 0);

  readonly stepTitle = computed(() => {
    const current = this.step();
    if (current === 'select') return 'Create new post';
    if (current === 'crop') return 'Crop';
    return 'Create new post';
  });

  goBack(): void {
    const current = this.step();
    if (current === 'crop') {
      this.step.set('select');
      return;
    }

    if (current === 'details') {
      this.step.set('crop');
    }
  }

  goNext(): void {
    const current = this.step();
    if (current === 'select' && this.canGoNextFromSelect()) {
      this.step.set('crop');
      return;
    }

    if (current === 'crop') {
      this.step.set('details');
    }
  }

  setImageUrl(value: string): void {
    this.imageUrl.set(value);
  }

  setSelectUrlDraft(value: string): void {
    this.selectUrlDraft.set(value);
  }

  applyUrlDraft(): void {
    const value = this.selectUrlDraft().trim();
    if (!value) {
      return;
    }

    this.imageUrl.set(value);
    this.imageSourceLabel.set('From URL');
  }

  onFileSelected(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        return;
      }

      this.imageUrl.set(result);
      this.imageSourceLabel.set(file.name);
      this.selectUrlDraft.set('');
    };
    reader.readAsDataURL(file);
  }

  setAspectRatio(value: AspectRatio): void {
    this.aspectRatio.set(value);
  }

  setCaption(value: string): void {
    this.caption.set(value);
  }

  setLocation(value: string): void {
    this.location.set(value);
  }

  setCollaborators(value: string): void {
    this.collaborators.set(value);
  }

  setPrivacy(value: string): void {
    if (
      value === 'Public' ||
      value === 'Followers' ||
      value === 'Close Friends'
    ) {
      this.privacy.set(value);
    }
  }

  toggleComments(): void {
    this.commentsEnabled.update((state) => !state);
  }

  toggleHideLikeCount(): void {
    this.hideLikeCount.update((state) => !state);
  }

  discardDraft(): void {
    this.step.set('select');
    this.imageUrl.set('');
    this.imageSourceLabel.set('No media selected');
    this.aspectRatio.set('portrait');
    this.caption.set('');
    this.location.set('');
    this.collaborators.set('');
    this.selectUrlDraft.set('');
    this.privacy.set('Public');
    this.commentsEnabled.set(true);
    this.hideLikeCount.set(false);
  }

  publish(): void {
    if (!this.canPublish()) {
      return;
    }

    const item: CreatedPost = {
      id: `new-${Date.now()}`,
      imageUrl: this.imageUrl().trim(),
      aspectRatio: this.aspectRatio(),
      caption: this.caption().trim(),
      location: this.location().trim(),
      privacy: this.privacy(),
      commentsEnabled: this.commentsEnabled(),
      hideLikeCount: this.hideLikeCount(),
      createdAt: new Date().toISOString(),
    };

    this.createdPosts.add(item);
    this.step.set('select');
    this.imageUrl.set('');
    this.imageSourceLabel.set('No media selected');
    this.aspectRatio.set('portrait');
    this.caption.set('');
    this.location.set('');
    this.collaborators.set('');
    this.selectUrlDraft.set('');
    this.privacy.set('Public');
    this.commentsEnabled.set(true);
    this.hideLikeCount.set(false);

    this.createModal.close();
    this.createModal.showToast('Post shared');
  }

  previewAspectClass(): string {
    const aspect = this.aspectRatio();
    if (aspect === 'square') return 'create__preview-image--square';
    if (aspect === 'landscape') return 'create__preview-image--landscape';
    return 'create__preview-image--portrait';
  }

  relativeTime(iso: string): string {
    const d = new Date(iso);
    const sec = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
    if (sec < 60) return `${sec}s ago`;
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    return `${Math.floor(sec / 86400)}d ago`;
  }
}
