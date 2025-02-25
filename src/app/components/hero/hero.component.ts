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
}
