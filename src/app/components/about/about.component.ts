import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('profileImage') profileImage!: ElementRef;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef;
  @ViewChild('aboutPointsContainer') aboutPointsContainer!: ElementRef;
  @ViewChild('aboutHeadingElement') aboutHeadingElement!: ElementRef;

  private typedInstance: any = null;

  /**
   * Initializes the component and sets up language change listener
   */
  ngOnInit() {
    window.addEventListener('languageChanged', (event: Event) => {
      const customEvent = event as CustomEvent;
      this.handleLanguageChange(customEvent.detail);
    });
  }

  /**
   * Initializes animations after view is ready
   */
  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  /**
   * Sets up the intersection observer to detect when section is visible
   */
  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const sectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options
    );

    sectionObserver.observe(this.aboutSection.nativeElement);
  }

  /**
   * Handles section intersection events
   * @param entries - Intersection observer entries
   */
  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.triggerAnimationSequence(entry.target);
        const observer = new IntersectionObserver(() => {}, {});
        observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Triggers the animation sequence when section becomes visible
   * @param target - The observed element
   */
  private triggerAnimationSequence(target: Element) {
    this.aboutSection.nativeElement.classList.add('perspective-active');

    setTimeout(() => {
      this.profileImage.nativeElement.classList.add('animate-in');
    }, 100);

    setTimeout(() => {
      this.contentWrapper.nativeElement.classList.add('animate-in');
      this.startTypingAnimation();
    }, 300);

    setTimeout(() => {
      this.animatePoints();
    }, 700);
  }

  /**
   * Handles language change events
   * @param language - The language code ('en' or 'de')
   */
  private handleLanguageChange(language: string) {
    if (this.typedInstance) {
      this.typedInstance.destroy();
      this.typedInstance = null;

      if (this.aboutHeadingElement?.nativeElement) {
        this.aboutHeadingElement.nativeElement.innerHTML = '';
      }
    }

    if (this.aboutHeadingElement?.nativeElement) {
      const text = language === 'de' ? 'Über mich' : 'About me';
      this.typedInstance = new Typed(this.aboutHeadingElement.nativeElement, {
        strings: [text],
        typeSpeed: 80,
        showCursor: true,
        cursorChar: '|',
      });
    }
  }

  /**
   * Initializes the typing animation for the section heading
   */
  startTypingAnimation() {
    if (this.typedInstance) {
      this.typedInstance.destroy();
    }

    const currentLang = localStorage.getItem('language') || 'en';
    const text = currentLang === 'de' ? 'Über mich' : 'About me';

    const typedOptions = {
      strings: [text],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
    };

    this.typedInstance = new Typed(
      this.aboutHeadingElement.nativeElement,
      typedOptions
    );
  }

  /**
   * Animates the about points with sequential fade-in
   */
  animatePoints() {
    const points =
      this.aboutPointsContainer.nativeElement.querySelectorAll('.about-point');

    points.forEach((point: Element, index: number) => {
      setTimeout(() => {
        point.classList.add('animate-in');
      }, index * 200);
    });
  }
}
