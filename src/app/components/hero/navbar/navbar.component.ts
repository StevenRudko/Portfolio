import { Component, OnInit } from '@angular/core';
import { translations } from './translations';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentLang: string = 'en';

  ngOnInit(): void {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLang = savedLang;
      this.applyTranslations();
    }
  }

  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'en' ? 'de' : 'en';
    localStorage.setItem('language', this.currentLang);
    this.applyTranslations();

    window.dispatchEvent(
      new CustomEvent('languageChanged', { detail: this.currentLang })
    );
  }

  private applyTranslations(): void {
    if (this.currentLang === 'en') {
      document.querySelectorAll('[data-translate]').forEach((element) => {
        const key = element.getAttribute('data-translate');
        if (key && element.hasAttribute('data-original')) {
          element.innerHTML = element.getAttribute('data-original') || '';
        }
      });
    } else {
      document.querySelectorAll('[data-translate]').forEach((element) => {
        const key = element.getAttribute('data-translate');
        if (key) {
          if (!element.hasAttribute('data-original')) {
            element.setAttribute('data-original', element.innerHTML);
          }

          const translationKey = key as keyof (typeof translations)['de'];
          if (translations['de'][translationKey]) {
            element.innerHTML = translations['de'][translationKey];
          }
        }
      });
    }

    document.querySelectorAll('.language-switch button').forEach((button) => {
      if (button.textContent?.trim() === 'EN') {
        button.classList.toggle('active', this.currentLang === 'en');
      } else if (button.textContent?.trim() === 'DE') {
        button.classList.toggle('active', this.currentLang === 'de');
      }
    });
  }
}
