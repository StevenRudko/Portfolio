import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements AfterViewInit {
  @ViewChild('skillsSection') skillsSection!: ElementRef;
  @ViewChild('skillsCard') skillsCard!: ElementRef;
  @ViewChild('skillsGrid') skillsGrid!: ElementRef;
  @ViewChild('skillsContent') skillsContent!: ElementRef;
  @ViewChild('leftColumn') leftColumn!: ElementRef;
  @ViewChild('skillHeadingElement') skillHeadingElement!: ElementRef;

  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.skillsSection.nativeElement.classList.add('perspective-active');

          setTimeout(() => {
            this.leftColumn.nativeElement.classList.add('animate-in');
          }, 100);

          setTimeout(() => {
            this.skillsCard.nativeElement.classList.add('animate-in');
            this.startTypingAnimation();
          }, 300);

          setTimeout(() => {
            this.skillsContent.nativeElement.classList.add('animate-in');
          }, 500);

          setTimeout(() => {
            this.animateSkills();
          }, 700);

          sectionObserver.unobserve(entry.target);
        }
      });
    }, options);

    sectionObserver.observe(this.skillsSection.nativeElement);
  }

  startTypingAnimation() {
    const typedOptions = {
      strings: ['Skill Set'],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
    };

    new Typed(this.skillHeadingElement.nativeElement, typedOptions);
  }

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
