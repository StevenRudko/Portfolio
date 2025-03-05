import { Component, OnInit, HostListener } from '@angular/core';
import { translations } from './translations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentLang: string = 'en';
  isMenuOpen: boolean = false;
  isAnimating: boolean = false;

  /**
   * Initialize component and load saved language
   */
  ngOnInit(): void {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLang = savedLang;
      this.applyTranslations();
    }
  }

  /**
   * Toggle mobile menu state and hide hero content
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';

    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const socialLinks = document.querySelector('.social-links');

    if (heroContent) {
      heroContent.classList.toggle('hidden', this.isMenuOpen);
    }

    if (scrollIndicator) {
      scrollIndicator.classList.toggle('hidden', this.isMenuOpen);
    }

    if (socialLinks) {
      socialLinks.classList.toggle('hidden', this.isMenuOpen);
    }
  }

  /**
   * Close mobile menu and show hero content
   */
  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';

      const heroContent = document.querySelector('.hero-content');
      const scrollIndicator = document.querySelector('.scroll-indicator');
      const socialLinks = document.querySelector('.social-links');

      if (heroContent) {
        heroContent.classList.remove('hidden');
      }

      if (scrollIndicator) {
        scrollIndicator.classList.remove('hidden');
      }

      if (socialLinks) {
        socialLinks.classList.remove('hidden');
      }
    }
  }

  /**
   * Close menu on window resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Toggle between languages with fade animation
   */
  toggleLanguage(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.startFadeOut();

    setTimeout(() => {
      this.switchLanguage();
      this.startFadeIn();
    }, 300);
  }

  /**
   * Start fade out animation
   */
  private startFadeOut(): void {
    document.querySelectorAll('[data-translate]').forEach((element) => {
      element.classList.add('fade-out');
    });
  }

  /**
   * Switch language and apply translations
   */
  private switchLanguage(): void {
    this.currentLang = this.currentLang === 'en' ? 'de' : 'en';
    localStorage.setItem('language', this.currentLang);
    this.applyTranslations();

    window.dispatchEvent(
      new CustomEvent('languageChanged', { detail: this.currentLang })
    );
  }

  /**
   * Start fade in animation and reset when complete
   */
  private startFadeIn(): void {
    document.querySelectorAll('[data-translate]').forEach((element) => {
      element.classList.remove('fade-out');
      element.classList.add('fade-in');
    });

    setTimeout(() => {
      document.querySelectorAll('[data-translate]').forEach((element) => {
        element.classList.remove('fade-in');
      });
      this.isAnimating = false;
    }, 500);
  }

  /**
   * Apply translations based on current language
   */
  private applyTranslations(): void {
    if (this.currentLang === 'en') {
      this.applyEnglishTranslations();
    } else {
      this.applyGermanTranslations();
    }
    this.updateLanguageButtons();
  }

  /**
   * Apply English translations
   */
  private applyEnglishTranslations(): void {
    document.querySelectorAll('[data-translate]').forEach((element) => {
      const key = element.getAttribute('data-translate');
      if (key && element.hasAttribute('data-original')) {
        element.innerHTML = element.getAttribute('data-original') || '';
      }
    });
  }

  /**
   * Apply German translations
   */
  private applyGermanTranslations(): void {
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

  /**
   * Update active state of language buttons
   */
  private updateLanguageButtons(): void {
    document.querySelectorAll('.language-switch button').forEach((button) => {
      if (button.textContent?.trim() === 'EN') {
        button.classList.toggle('active', this.currentLang === 'en');
      } else if (button.textContent?.trim() === 'DE') {
        button.classList.toggle('active', this.currentLang === 'de');
      }
    });
  }
}
