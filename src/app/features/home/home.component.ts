import { Component } from '@angular/core';
import { StoriesComponent } from '../stories/stories.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
