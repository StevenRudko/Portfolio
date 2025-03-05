import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

interface Testimonial {
  text: string;
  author: string;
  position: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
  animations: [
    trigger('textSlide', [
      state('next', style({ transform: 'translateX(0)', opacity: 1 })),
      state('prev', style({ transform: 'translateX(0)', opacity: 1 })),
      state('initial', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('void => next', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '500ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition('void => prev', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '500ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition('* => next', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '500ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition('* => prev', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '500ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class TestimonialsComponent implements OnInit, AfterViewInit {
  @ViewChild('testimonialsSection') testimonialsSection!: ElementRef;
  @ViewChild('testimonialContent') testimonialContent!: ElementRef;

  currentLang: string = 'en';
  slideDirection = 'initial';
  activeIndex = 0;
  isAnimating = false;

  // Für Animation Reset
  animationKey = 0;

  testimonials = [
    {
      text: 'Steven is a creative developer who brought fresh ideas and positive vibes to the project. Always ready to help, his keen eye for detail, especially in design, really pushed our work forward. His open and easygoing nature makes collaboration a breeze!',
      author: 'Robert Greulich',
      position: 'Team Partner',
    },
    {
      text: 'Steven is an expert in coding who always remains calm under pressure. His exceptional ability to achieve goals with 100% precision and success sets him apart. His composure and professionalism establish a strong foundation for a bright and successful future.',
      author: 'Yasin Sun',
      position: 'Team Partner',
    },
    {
      text: '',
      author: '',
      position: '',
    },
    {
      text: '',
      author: '',
      position: '',
    },
  ];

  testimonialsDe = [
    {
      text: 'Steven ist ein kreativer Entwickler, der frische Ideen und positive Energie in das Projekt eingebracht hat. Stets hilfsbereit, hat sein Auge fürs Detail, besonders im Design, unsere Arbeit wirklich vorangebracht. Seine offene und umgängliche Art macht die Zusammenarbeit zum Vergnügen!',
      author: 'Robert Greulich',
      position: 'Teampartner',
    },
    {
      text: 'Steven ist ein Experte im Programmieren, der auch unter Druck stets ruhig bleibt. Seine außergewöhnliche Fähigkeit, Ziele mit 100% Präzision und Erfolg zu erreichen, hebt ihn hervor. Seine Gelassenheit und Professionalität schaffen eine starke Grundlage für eine vielversprechende und erfolgreiche Zukunft.',
      author: 'Yasin Sun',
      position: 'Teampartner',
    },
    {
      text: '',
      author: '',
      position: '',
    },
    {
      text: '',
      author: '',
      position: '',
    },
  ];

  /**
   * Initializes component and sets up language listener
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
   * Sets up intersection observer for scroll animation
   */
  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.testimonialContent.nativeElement.classList.add('animate-in');
          }, 300);

          sectionObserver.unobserve(entry.target);
        }
      });
    }, options);

    sectionObserver.observe(this.testimonialsSection.nativeElement);
  }

  /**
   * Returns localized testimonial based on current language
   */
  getLocalizedTestimonial(index: number): Testimonial {
    return this.currentLang === 'de'
      ? this.testimonialsDe[index]
      : this.testimonials[index];
  }

  /**
   * Checks if there are valid testimonials ahead in the given direction
   */
  hasValidTestimonials(direction: 'prev' | 'next'): boolean {
    if (direction === 'next') {
      // Prüfe ob es noch gültige Testimonials nach dem aktuellen gibt
      for (let i = 1; i < this.testimonials.length; i++) {
        const index = (this.activeIndex + i) % this.testimonials.length;
        if (this.getLocalizedTestimonial(index).text !== '') {
          return true;
        }
      }
    } else {
      // Prüfe ob es noch gültige Testimonials vor dem aktuellen gibt
      for (let i = 1; i < this.testimonials.length; i++) {
        const index =
          (this.activeIndex - i + this.testimonials.length) %
          this.testimonials.length;
        if (this.getLocalizedTestimonial(index).text !== '') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Navigates to previous testimonial with animation
   */
  prevTestimonial() {
    if (this.isAnimating) return;
    if (!this.hasValidTestimonials('prev')) return;

    this.isAnimating = true;
    this.slideDirection = 'prev';

    // Animation key triggert ein Re-rendering des Elements
    this.animationKey++;

    setTimeout(() => {
      let newIndex = this.activeIndex;
      do {
        newIndex =
          (newIndex - 1 + this.testimonials.length) % this.testimonials.length;
      } while (this.getLocalizedTestimonial(newIndex).text === '');

      this.activeIndex = newIndex;

      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }, 300);
  }

  /**
   * Navigates to next testimonial with animation
   */
  nextTestimonial() {
    if (this.isAnimating) return;
    if (!this.hasValidTestimonials('next')) return;

    this.isAnimating = true;
    this.slideDirection = 'next';

    // Animation key triggert ein Re-rendering des Elements
    this.animationKey++;

    setTimeout(() => {
      let newIndex = this.activeIndex;
      do {
        newIndex = (newIndex + 1) % this.testimonials.length;
      } while (this.getLocalizedTestimonial(newIndex).text === '');

      this.activeIndex = newIndex;

      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }, 300);
  }

  /**
   * Navigates to specific testimonial with animation
   */
  goToTestimonial(index: number) {
    if (this.isAnimating) return;
    if (index === this.activeIndex) return;
    if (this.getLocalizedTestimonial(index).text !== '') {
      this.isAnimating = true;
      this.slideDirection = index > this.activeIndex ? 'next' : 'prev';

      // Animation key triggert ein Re-rendering des Elements
      this.animationKey++;

      setTimeout(() => {
        this.activeIndex = index;

        setTimeout(() => {
          this.isAnimating = false;
        }, 500);
      }, 300);
    }
  }

  /**
   * Returns array of valid testimonial indices
   */
  get validTestimonials(): number[] {
    return this.testimonials
      .map((t, i) => (this.getLocalizedTestimonial(i).text !== '' ? i : -1))
      .filter((i) => i !== -1);
  }
}
