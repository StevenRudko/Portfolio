import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  loadingProgress = 0;

  constructor() {
    this.startProgressSimulation();
  }

  /**
   * Simulates loading progress animation
   */
  private startProgressSimulation() {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 30) {
        progress += 1;
      } else if (progress < 60) {
        progress += 1.5;
      } else if (progress < 80) {
        progress += 0.7;
      } else if (progress < 98) {
        progress += 0.3;
      } else {
        progress = 100;
        clearInterval(interval);
      }

      this.loadingProgress = Math.min(progress, 100);
    }, 50);
  }
}
