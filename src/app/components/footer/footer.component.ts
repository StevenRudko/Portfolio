import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalNoticeComponent } from '../legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

/**
 * Footer component for the portfolio
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LegalNoticeComponent, PrivacyPolicyComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  @ViewChild(LegalNoticeComponent) legalNotice!: LegalNoticeComponent;
  @ViewChild(PrivacyPolicyComponent) privacyPolicy!: PrivacyPolicyComponent;
  currentYear: number = new Date().getFullYear();
  currentLang: string = 'en';

  /**
   * Initializes the component and sets up language listener
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
   * Opens the legal notice overlay
   */
  openLegalNotice(event: Event) {
    event.preventDefault();
    this.legalNotice.open();
  }

  /**
   * Opens the privacy policy overlay
   */
  openPrivacyPolicy(event: Event) {
    event.preventDefault();
    this.privacyPolicy.open();
  }
}
