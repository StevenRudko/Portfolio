import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import Typed from 'typed.js';

/**
 * Projects component with list, preview, and detail overlay
 */
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' })
        ),
      ]),
    ]),
  ],
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('projectsSection') projectsSection!: ElementRef;
  @ViewChild('headerSection') headerSection!: ElementRef;
  @ViewChild('projectsList') projectsList!: ElementRef;
  @ViewChild('projectsHeadingElement') projectsHeadingElement!: ElementRef;

  activeProject: string | null = null;
  activeProjectData: any = null;
  previewProject: string | null = null;

  projectsData = {
    join: {
      number: '01',
      title: 'Join',
      description:
        'A Kanban project management tool with drag and drop functionality, user authentication, and task management features.',
      technologies: [
        { name: 'Angular', class: 'angular' },
        { name: 'TypeScript', class: 'ts' },
        { name: 'HTML', class: 'html' },
        { name: 'CSS', class: 'css' },
        { name: 'Firebase', class: 'firebase' },
      ],
      githubLink: 'https://github.com/yourusername/join',
      liveLink: 'https://join-project.yourdomain.com',
      image: '/projects/join.png',
      previewImage: '/projects/join.png',
    },
    cyberSteve: {
      number: '02',
      title: 'CYBERSTEVE',
      description:
        'CYBERSTEVE" is a 2D cyberpunk shooter. Jump, run, and fight through a neon-lit city and battling robots. Energy cells to power up and survive the digital war.',
      technologies: [
        { name: 'JavaScript', class: 'js' },
        { name: 'HTML', class: 'html' },
        { name: 'CSS', class: 'css' },
      ],
      githubLink: 'https://github.com/yourusername/el-pollo-loco',
      liveLink: 'https://el-pollo-loco.yourdomain.com',
      image: '/projects/cybersteve.png',
      previewImage: '/projects/cybersteve.png',
    },
    daBubble: {
      number: '03',
      title: 'DA Bubble',
      description:
        'A modern messaging application with real-time chat functionality, channels, direct messages and thread replies.',
      technologies: [
        { name: 'Angular', class: 'angular' },
        { name: 'Firebase', class: 'firebase' },
        { name: 'TypeScript', class: 'ts' },
      ],
      githubLink: 'https://github.com/yourusername/da-bubble',
      liveLink: 'https://da-bubble.yourdomain.com',
      image: '/projects/dabubble.png',
      previewImage: '/projects/dabubble.png',
    },
  };

  /**
   * Initializes animations after view render
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
            this.headerSection.nativeElement.classList.add('animate-in');
            this.startTypingAnimation();
          }, 300);

          setTimeout(() => {
            this.projectsList.nativeElement.classList.add('animate-in');
          }, 600);

          sectionObserver.unobserve(entry.target);
        }
      });
    }, options);

    sectionObserver.observe(this.projectsSection.nativeElement);
  }

  /**
   * Creates typing animation for heading
   */
  startTypingAnimation() {
    const typedOptions = {
      strings: ['Featured Projects'],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
    };

    new Typed(this.projectsHeadingElement.nativeElement, typedOptions);
  }

  /**
   * Shows preview image for project on hover
   */
  showPreview(projectId: string) {
    this.previewProject = projectId;
  }

  /**
   * Hides preview image
   */
  hidePreview() {
    this.previewProject = null;
  }

  /**
   * Gets preview image path
   */
  getPreviewImage(): string {
    if (!this.previewProject) return '';
    return this.projectsData[
      this.previewProject as keyof typeof this.projectsData
    ].previewImage;
  }

  /**
   * Opens project details overlay
   */
  openProjectDetails(projectId: string) {
    this.activeProject = projectId;
    this.activeProjectData =
      this.projectsData[projectId as keyof typeof this.projectsData];
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes project details overlay
   */
  closeProjectDetails() {
    this.activeProject = null;
    this.activeProjectData = null;
    document.body.style.overflow = 'auto';
  }

  /**
   * Navigates to next project in overlay
   */
  goToNextProject() {
    const projectIds = Object.keys(this.projectsData);
    const currentIndex = projectIds.indexOf(this.activeProject as string);
    const nextIndex = (currentIndex + 1) % projectIds.length;

    this.activeProject = projectIds[nextIndex];
    this.activeProjectData =
      this.projectsData[this.activeProject as keyof typeof this.projectsData];
  }

  /**
   * Handles click outside overlay to close it
   */
  handleOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeProjectDetails();
    }
  }

  /**
   * Handles click outside of section elements
   */
  handleOutsideClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
    }
  }
}
