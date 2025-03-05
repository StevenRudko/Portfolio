import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FooterComponent } from '../footer/footer.component';

/**
 * Legal Notice page component
 */
@Component({
  selector: 'app-legal-notice-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss',
})
export class LegalNoticePageComponent implements OnInit {
  currentLang: string = 'en';

  /**
   * Initializes language settings and sets page title
   */
  constructor(private titleService: Title) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLang = savedLang;
    }

    window.addEventListener('languageChanged', (event: Event) => {
      const customEvent = event as CustomEvent;
      this.currentLang = customEvent.detail;
      this.updateTitle();
    });

    this.updateTitle();
  }

  /**
   * Updates page title based on language
   */
  private updateTitle() {
    const title =
      this.currentLang === 'de'
        ? 'Impressum | Steven Rudko'
        : 'Legal Notice | Steven Rudko';
    this.titleService.setTitle(title);
  }
}
