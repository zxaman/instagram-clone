import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { X } from '../../core/icons';
import { CreateModalService } from '../../core/create-modal.service';
import { CreateComponent } from './create.component';

@Component({
  selector: 'app-create-modal',
  imports: [LucideAngularModule, CreateComponent],
  templateUrl: './create-modal.component.html',
  styleUrl: './create-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class CreateModalComponent {
  readonly X = X;

  private readonly document = inject(DOCUMENT);
  readonly modal = inject(CreateModalService);

  constructor() {
    effect((onCleanup) => {
      const body = this.document.body;
      const previousOverflow = body.style.overflow;

      body.style.overflow = this.modal.isOpen() ? 'hidden' : '';

      onCleanup(() => {
        body.style.overflow = previousOverflow;
      });
    });
  }

  close(): void {
    this.modal.close();
  }
}
