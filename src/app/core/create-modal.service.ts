import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreateModalService {
  readonly isOpen = signal(false);
  readonly toastMessage = signal<string | null>(null);

  private toastTimerId: number | null = null;

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  showToast(message: string, durationMs = 2200): void {
    this.toastMessage.set(message);

    if (this.toastTimerId !== null) {
      window.clearTimeout(this.toastTimerId);
    }

    this.toastTimerId = window.setTimeout(() => {
      this.toastMessage.set(null);
      this.toastTimerId = null;
    }, durationMs);
  }
}
