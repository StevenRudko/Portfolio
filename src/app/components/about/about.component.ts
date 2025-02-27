import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('profileImage') profileImage!: ElementRef;
  @ViewChild('contentWrapper') contentWrapper!: ElementRef;
  @ViewChild('aboutPointsContainer') aboutPointsContainer!: ElementRef;
  @ViewChild('aboutHeadingElement') aboutHeadingElement!: ElementRef;

  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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

          sectionObserver.unobserve(entry.target);
        }
      });
    }, options);

    sectionObserver.observe(this.aboutSection.nativeElement);
  }

  startTypingAnimation() {
    const typedOptions = {
      strings: ['About me'],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
    };

    new Typed(this.aboutHeadingElement.nativeElement, typedOptions);
  }

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
