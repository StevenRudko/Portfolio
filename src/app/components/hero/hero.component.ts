import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import Typed from 'typed.js';

@Component({
  selector: 'app-hero',
  imports: [NavbarComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  standalone: true,
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('jobTitleElement') jobTitleElement!: ElementRef;
  @ViewChild('nameElement') nameElement!: ElementRef;

  /**
   * Initializes animations and UI components after view is ready
   */
  ngAfterViewInit() {
    this.initializeJobTitleAnimation();
    this.setupScrollButton();
  }

  /**
   * Sets up the job title typing animation
   */
  private initializeJobTitleAnimation() {
    const jobTitleOptions = {
      strings: ['Frontend Developer'],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
      onComplete: (self: any) => {
        setTimeout(() => {
          this.typeNameAnimation();
        }, 250);
      },
    };

    new Typed(this.jobTitleElement.nativeElement, jobTitleOptions);
  }

  /**
   * Animates the name element with typing effect
   */
  typeNameAnimation() {
    const nameOptions = {
      strings: ['Steven Rudko'],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
      onComplete: (self: any) => {
        document.getElementById('buttons')?.classList.add('fade-in');
      },
    };

    new Typed(this.nameElement.nativeElement, nameOptions);
  }

  /**
   * Sets up smooth scrolling and scroll button functionality
   */
  setupScrollButton() {
    const scrollButton = document.querySelector(
      '.scroll-indicator a'
    ) as HTMLAnchorElement;

    if (scrollButton) {
      this.configureScrollButtonClick(scrollButton);
      this.setupScrollButtonVisibility(scrollButton);
    }
  }

  /**
   * Configures click behavior for the scroll button
   * @param scrollButton - The scroll button element
   */
  private configureScrollButtonClick(scrollButton: HTMLAnchorElement) {
    scrollButton.addEventListener('click', (e) => {
      e.preventDefault();
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /**
   * Sets up observer to control scroll button visibility
   * @param scrollButton - The scroll button element
   */
  private setupScrollButtonVisibility(scrollButton: HTMLAnchorElement) {
    const heroSection = document.querySelector('app-hero section');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          scrollButton.parentElement?.classList.add('hidden');
        } else {
          scrollButton.parentElement?.classList.remove('hidden');
        }
      });
    }, options);

    if (heroSection) {
      observer.observe(heroSection);
    }
  }
}
