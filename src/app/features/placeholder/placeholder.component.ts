import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss',
})
export class PlaceholderComponent {
  pageName = 'Page';

  constructor(private route: ActivatedRoute) {
    this.pageName = this.route.snapshot.data['pageName'] ?? 'Page';
  }
}
