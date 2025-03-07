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
  selectedProject: string | null = null;
  isVideoPlaying = false;
  currentLang: string = 'en';
  imagesLoaded: { [key: string]: boolean } = {};
  videosLoaded: { [key: string]: boolean } = {};
  isTouchDevice = false;
  savedScrollPosition = 0;
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
      liveLink: 'https://join.stevenrudko.com',
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
      liveLink: 'https://cybersteve.stevenrudko.com',
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
      liveLink: 'https://dabubble.stevenrudko.com',
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

    this.isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    this.preloadAssets();
  }

  /**
   * Preloads all project images and videos
   */
  preloadAssets() {
    const projectIds = Object.keys(this.projectsData);
    projectIds.forEach((projectId) => {
      const project =
        this.projectsData[projectId as keyof typeof this.projectsData];
      this.preloadProjectAssets(project, projectId);
    });
  }

  /**
   * Preloads assets for a specific project
   */
  preloadProjectAssets(project: any, projectId: string) {
    if (project.image) {
      this.preloadImage(project.image, projectId, 'main');
    }
    if (project.previewImage && project.previewImage !== project.image) {
      this.preloadImage(project.previewImage, projectId, 'preview');
    }
    if (project.videoUrl) {
      this.preloadVideo(project.videoUrl, projectId);
    }
  }

  /**
   * Preloads a single image
   */
  preloadImage(imageUrl: string, projectId: string, type: string) {
    const key = `${projectId}-${type}`;
    this.imagesLoaded[key] = false;

    const img = new Image();
    img.onload = () => {
      this.imagesLoaded[key] = true;
    };
    img.onerror = () => {
      this.imagesLoaded[key] = true;
    };
    img.src = imageUrl;
  }

  /**
   * Preloads video thumbnail by loading metadata
   */
  preloadVideo(videoUrl: string, projectId: string) {
    this.videosLoaded[projectId] = false;

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;

    video.onloadeddata = () => {
      this.videosLoaded[projectId] = true;
    };

    video.onerror = () => {
      this.videosLoaded[projectId] = true;
    };

    video.src = videoUrl;
  }

  /**
   * Checks if a project's assets are fully loaded
   */
  isProjectLoaded(projectId: string | null): boolean {
    if (!projectId) return false;

    const mainImageLoaded = this.imagesLoaded[`${projectId}-main`] !== false;
    const previewImageLoaded =
      this.imagesLoaded[`${projectId}-preview`] !== false;
    const videoLoaded =
      !this.projectsData[projectId as keyof typeof this.projectsData]
        .videoUrl || this.videosLoaded[projectId] !== false;

    return mainImageLoaded && previewImageLoaded && videoLoaded;
  }

  /**
   * Initializes animations after view render
   */
  ngAfterViewInit() {
    this.setupSectionObserver();
  }

  /**
   * Sets up observer for section animation
   */
  setupSectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver(
      this.handleSectionIntersection.bind(this),
      options
    );
    observer.observe(this.projectsSection.nativeElement);
  }

  /**
   * Handles section intersection events
   */
  handleSectionIntersection(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.animateSectionElements();
        observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Animates section elements
   */
  animateSectionElements() {
    setTimeout(() => {
      this.headerSection.nativeElement.classList.add('animate-in');
      this.startTypingAnimation();
    }, 150);

    setTimeout(() => {
      this.projectsList.nativeElement.classList.add('animate-in');
    }, 300);
  }

  /**
   * Creates typing animation for heading
   */
  startTypingAnimation() {
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
   * Handles project click based on device type
   */
  handleProjectClick(projectId: string) {
    if (this.isTouchDevice) {
      this.openProjectDetails(projectId);
    } else {
      this.openProjectDetails(projectId);
    }
  }

  /**
   * Shows preview image for project on hover (desktop only)
   */
  showPreview(projectId: string) {
    if (!this.isTouchDevice) {
      this.previewProject = projectId;
    }
  }

  /**
   * Hides preview image (desktop only)
   */
  hidePreview() {
    if (!this.isTouchDevice) {
      this.previewProject = null;
    }
  }

  /**
   * Gets preview image path
   */
  getPreviewImage(): string {
    const projectId = this.previewProject || this.selectedProject;
    if (!projectId) return '';

    const imagePath =
      this.projectsData[projectId as keyof typeof this.projectsData]
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

    this.lockBodyScroll();
  }

  /**
   * Locks body scroll when overlay is open
   */
  lockBodyScroll() {
    this.savedScrollPosition = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${this.savedScrollPosition}px`;
    document.body.style.overflow = 'hidden';
  }

  closeProjectDetails() {
    const scrollY = parseInt(document.body.style.top || '0') * -1;

    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.overflow = '';

    this.activeProject = null;
    this.activeProjectData = null;

    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'temp-scroll-style');
    styleElement.textContent = 'html { scroll-behavior: auto !important; }';
    document.head.appendChild(styleElement);
    window.scrollTo(0, scrollY);

    setTimeout(
      () => document.getElementById('temp-scroll-style')?.remove(),
      20
    );
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
    const nextProjectId = projectIds[nextIndex];

    this.activeProject = nextProjectId;
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
    if (event.target === event.currentTarget && this.selectedProject) {
      this.selectedProject = null;
      this.previewProject = null;
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
      videoElement.play().catch(() => {});
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
