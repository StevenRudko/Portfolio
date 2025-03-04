import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Legal Notice component
 */
@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss',
})
export class LegalNoticeComponent implements OnInit {
  isVisible = false;
  currentLang: string = 'en';

  /**
   * Initializes language settings
   */
  ngOnInit() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLang = savedLang;
    }

    window.addEventListener('languageChanged', (event: Event) => {
      const customEvent = event as CustomEvent;
      this.currentLang = customEvent.detail;
    });
  }

  /**
   * Opens the legal notice modal
   */
  open() {
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the legal notice modal
   */
  close() {
    this.isVisible = false;
    document.body.style.overflow = 'auto';
  }

  /**
   * Handles click outside to close modal
   * @param event The mouse event
   */
  @HostListener('click', ['$event'])
  onOverlayClick(event: MouseEvent) {
    if (
      (event.target as HTMLElement).classList.contains('legal-notice-overlay')
    ) {
      this.close();
    }
  }

  /**
   * Handles escape key to close modal
   */
  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.close();
  }
}
