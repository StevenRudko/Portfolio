import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit, AfterViewInit {
  @ViewChild('skillsSection') skillsSection!: ElementRef;
  @ViewChild('skillsCard') skillsCard!: ElementRef;
  @ViewChild('skillsGrid') skillsGrid!: ElementRef;
  @ViewChild('skillsContent') skillsContent!: ElementRef;
  @ViewChild('leftColumn') leftColumn!: ElementRef;
  @ViewChild('skillHeadingElement') skillHeadingElement!: ElementRef;

  private typedInstance: any = null;

  /**
   * Initializes component and sets up language change listener
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

    sectionObserver.observe(this.skillsSection.nativeElement);
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
    this.skillsSection.nativeElement.classList.add('perspective-active');

    setTimeout(() => {
      this.leftColumn.nativeElement.classList.add('animate-in');
    }, 100);

    this.animateCardAndText();
    this.animateSkillsWithDelay();
  }

  /**
   * Animates card and initializes text animation
   */
  private animateCardAndText() {
    setTimeout(() => {
      this.skillsCard.nativeElement.classList.add('animate-in');
      this.startTypingAnimation();
    }, 300);

    setTimeout(() => {
      this.skillsContent.nativeElement.classList.add('animate-in');
    }, 500);
  }

  /**
   * Sets up delayed animation for skills grid
   */
  private animateSkillsWithDelay() {
    setTimeout(() => {
      this.animateSkills();
    }, 700);
  }

  /**
   * Handles language change events
   * @param language - The language code ('en' or 'de')
   */
  private handleLanguageChange(language: string) {
    this.resetTypedAnimation();
    this.createNewTypedAnimation(language);
  }

  /**
   * Resets the current typed animation instance
   */
  private resetTypedAnimation() {
    if (this.typedInstance) {
      this.typedInstance.destroy();
      this.typedInstance = null;

      if (this.skillHeadingElement?.nativeElement) {
        this.skillHeadingElement.nativeElement.innerHTML = '';
      }
    }
  }

  /**
   * Creates a new typed animation with correct language
   * @param language - The language code ('en' or 'de')
   */
  private createNewTypedAnimation(language: string) {
    if (this.skillHeadingElement?.nativeElement) {
      const text = language === 'de' ? 'Skillset' : 'Skill Set';
      this.typedInstance = new Typed(this.skillHeadingElement.nativeElement, {
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
    this.resetTypedAnimation();

    const currentLang = localStorage.getItem('language') || 'en';
    const text = currentLang === 'de' ? 'Skillset' : 'Skill Set';

    const typedOptions = {
      strings: [text],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
    };

    this.typedInstance = new Typed(
      this.skillHeadingElement.nativeElement,
      typedOptions
    );
  }

  /**
   * Animates the skills grid with sequential fade-in
   */
  animateSkills() {
    const skills =
      this.skillsGrid.nativeElement.querySelectorAll('.skill-item');

    skills.forEach((skill: Element, index: number) => {
      setTimeout(() => {
        skill.classList.add('animate-in');
      }, index * 100);
    });
  }
}
