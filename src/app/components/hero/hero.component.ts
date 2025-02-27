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

  ngAfterViewInit() {
    const jobTitleOptions = {
      strings: ['Frontend Developer'],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
      onComplete: (self: any) => {
        setTimeout(() => {
          this.typeNameAnimation();
        }, 500);
      },
    };

    new Typed(this.jobTitleElement.nativeElement, jobTitleOptions);

    // Scroll-Button nur auf der ersten Sektion anzeigen
    this.setupScrollButton();
  }

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

  // Neue Methode für Scroll-Button
  setupScrollButton() {
    const scrollButton = document.querySelector(
      '.scroll-indicator a'
    ) as HTMLAnchorElement;

    if (scrollButton) {
      // Event-Listener für glattes Scrollen
      scrollButton.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      });

      // Scroll-Observer, um Button auszublenden, wenn nicht im Hero-Bereich
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
}
