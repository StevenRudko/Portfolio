import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  style,
  animate,
  transition,
  state,
} from '@angular/animations';
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
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
          visibility: 'hidden',
        })
      ),
      transition('hidden => visible', [
        style({ visibility: 'visible' }),
        animate('300ms ease-out'),
      ]),
      transition('visible => hidden', [
        animate(
          '200ms ease-in',
          style({
            opacity: 0,
            transform: 'translateY(20px)',
          })
        ),
        style({ visibility: 'hidden' }),
      ]),
    ]),
  ],
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  @ViewChild('projectsSection') projectsSection!: ElementRef;
  @ViewChild('headerSection') headerSection!: ElementRef;
  @ViewChild('projectsList') projectsList!: ElementRef;
  @ViewChild('projectsHeadingElement') projectsHeadingElement!: ElementRef;

  activeProject: string | null = null;
  activeProjectData: any = null;
  previewProject: string | null = null;
  isVideoPlaying = false;
  currentLang: string = 'en';
  private typedInstance: any = null;

  projectsData = {
    join: {
      number: '01',
      title: 'Join',
      description:
        'A Kanban project management tool with drag and drop functionality, user authentication, and task management features.',
      descriptionDe:
        'Ein Kanban-Projektmanagement-Tool mit Drag-and-Drop-Funktionalität, Benutzerauthentifizierung und Aufgabenverwaltungsfunktionen.',
      technologies: [
        { name: 'HTML', class: 'html' },
        { name: 'CSS', class: 'css' },
        { name: 'JavaScript', class: 'js' },
        { name: 'Firebase', class: 'firebase' },
      ],
      githubLink: 'https://github.com/StevenRudko/Join',
      liveLink: 'https://join-project.yourdomain.com',
      image: '/projects/join.png',
      previewImage: '/projects/join.png',
      videoUrl: '/projects/join-video.mkv',
    },
    cyberSteve: {
      number: '02',
      title: 'CYBERSTEVE',
      description:
        '"CYBERSTEVE" is a 2D cyberpunk shooter. Jump, run, and fight through a neon-lit city and battling robots.',
      descriptionDe:
        '"CYBERSTEVE" ist ein 2D-Cyberpunk-Shooter. Springe, laufe und kämpfe durch eine neonbeleuchtete Stadt und bekämpfe Roboter.',
      technologies: [
        { name: 'HTML', class: 'html' },
        { name: 'CSS', class: 'css' },
        { name: 'JavaScript', class: 'js' },
      ],
      githubLink: 'https://github.com/StevenRudko/CYBERSTEVE',
      liveLink: 'https://el-pollo-loco.yourdomain.com',
      image: '/projects/cybersteve.png',
      previewImage: '/projects/cybersteve.png',
      videoUrl: '/projects/cybersteve-video.mkv',
    },
    daBubble: {
      number: '03',
      title: 'DA Bubble',
      description:
        'A modern messaging application with real-time chat functionality, channels, direct messages and thread replies.',
      descriptionDe:
        'Eine moderne Messaging-Anwendung mit Echtzeit-Chat-Funktionalität, Kanälen, Direktnachrichten und Thread-Antworten.',
      technologies: [
        { name: 'Angular', class: 'angular' },
        { name: 'TypeScript', class: 'ts' },
        { name: 'SCSS', class: 'scss' },
        { name: 'Firebase', class: 'firebase' },
      ],
      githubLink: 'https://github.com/Pesendorfer90/dabubble',
      liveLink: 'https://da-bubble.yourdomain.com',
      image: '/projects/dabubble.png',
      previewImage: '/projects/dabubble.png',
      videoUrl: '/projects/dabubble-video.mkv',
    },
  };

  /**
   * Initializes component and sets up language change listener
   */
  ngOnInit() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLang = savedLang;
    }

    window.addEventListener('languageChanged', (event: Event) => {
      const customEvent = event as CustomEvent;
      this.currentLang = customEvent.detail;
      this.updateTypedAnimation();
    });
  }

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
    // Destroy existing instance if it exists
    if (this.typedInstance) {
      this.typedInstance.destroy();
    }

    const text =
      this.currentLang === 'de' ? 'Ausgewählte Projekte' : 'Featured Projects';

    const typedOptions = {
      strings: [text],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: '|',
    };

    this.typedInstance = new Typed(
      this.projectsHeadingElement.nativeElement,
      typedOptions
    );
  }

  /**
   * Updates the typed animation when language changes
   */
  updateTypedAnimation() {
    if (this.typedInstance) {
      this.typedInstance.destroy();
      this.typedInstance = null;

      if (this.projectsHeadingElement?.nativeElement) {
        this.projectsHeadingElement.nativeElement.innerHTML = '';
      }
    }

    if (this.projectsHeadingElement?.nativeElement) {
      const text =
        this.currentLang === 'de'
          ? 'Ausgewählte Projekte'
          : 'Featured Projects';
      this.typedInstance = new Typed(
        this.projectsHeadingElement.nativeElement,
        {
          strings: [text],
          typeSpeed: 80,
          showCursor: true,
          cursorChar: '|',
        }
      );
    }
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

    const imagePath =
      this.projectsData[this.previewProject as keyof typeof this.projectsData]
        ?.previewImage || '';
    return imagePath;
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
   * Returns localized project description based on current language
   */
  getLocalizedProjectDescription(): string {
    if (!this.activeProjectData) return '';

    return this.currentLang === 'de'
      ? this.activeProjectData.descriptionDe
      : this.activeProjectData.description;
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

  /**
   * Check if current project has a video
   */
  hasProjectVideo(): boolean {
    return this.activeProjectData && !!this.activeProjectData.videoUrl;
  }

  /**
   * Starts video playback on hover
   */
  playProjectVideo(): void {
    if (!this.activeProjectData?.videoUrl) return;

    const videoElement = document.querySelector(
      '.project-video'
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement
        .play()
        .catch((error) => console.error('Error playing video:', error));
    }
  }

  /**
   * Pauses video when not hovering
   */
  pauseProjectVideo(): void {
    const videoElement = document.querySelector(
      '.project-video'
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement.pause();
    }
  }
}
