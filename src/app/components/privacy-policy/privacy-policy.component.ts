import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NavbarComponent } from '../hero/navbar/navbar.component';

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterModule, NavbarComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyPageComponent implements OnInit {
  currentLang: string = 'en';

  constructor(private titleService: Title) {}

  /**
   * Initializes language settings and sets page title
   */
  ngOnInit() {
    this.setupLanguage();
    this.updateTitle();
    this.scrollToTop();
  }

  /**
   * Sets up language from storage and event listener
   */
  private setupLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLang = savedLang;
    }

    window.addEventListener('languageChanged', (event: Event) => {
      const customEvent = event as CustomEvent;
      this.currentLang = customEvent.detail;
      this.updateTitle();
    });
  }

  /**
   * Updates page title based on current language
   */
  private updateTitle() {
    const title =
      this.currentLang === 'de'
        ? 'Datenschutzerklärung | Steven Rudko'
        : 'Privacy Policy | Steven Rudko';
    this.titleService.setTitle(title);
  }

  /**
   * Forces page to scroll to top
   */
  private scrollToTop() {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
  }
}
