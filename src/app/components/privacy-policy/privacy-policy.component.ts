import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Privacy Policy component
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
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
   * Opens the privacy policy modal
   */
  open() {
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the privacy policy modal
   */
  close() {
    this.isVisible = false;
    document.body.style.overflow = 'auto';
  }

  /**
   * Handles click outside to close modal
   */
  @HostListener('click', ['$event'])
  onOverlayClick(event: MouseEvent) {
    if (
      (event.target as HTMLElement).classList.contains('privacy-policy-overlay')
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
