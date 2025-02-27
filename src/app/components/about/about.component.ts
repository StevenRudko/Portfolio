import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

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
