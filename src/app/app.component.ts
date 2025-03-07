import {
  Component,
  OnInit,
  ViewContainerRef,
  ApplicationRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, Event } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Portfolio';
  assetsLoaded = false;
  isHomePage = true;

  constructor(
    private router: Router,
    private titleService: Title,
    private viewContainerRef: ViewContainerRef,
    private appRef: ApplicationRef
  ) {
    this.setupRouterEvents();
  }

  /**
   * Sets up router event listeners for page navigation
   */
  private setupRouterEvents() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(this.handleNavigationEnd.bind(this));
  }

  /**
   * Handles navigation end events
   */
  private handleNavigationEnd(event: NavigationEnd) {
    this.isHomePage = event.urlAfterRedirects === '/';

    if (this.isHomePage) {
      this.titleService.setTitle('Steven Rudko | Portfolio');
    }

    if (!this.isHomePage) {
      this.scrollToTop();
    }
  }

  /**
   * Scrolls the page to top using multiple methods for compatibility
   */
  private scrollToTop() {
    this.appRef.tick();

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }, 100);
  }

  /**
   * Initializes component and sets up loading animation
   */
  ngOnInit() {
    setTimeout(() => {
      this.startLoading();
    }, 100);
  }

  /**
   * Starts loading process with a safety timeout
   */
  private startLoading() {
    const maxLoadingTime = 5000;

    if (document.readyState === 'complete') {
      setTimeout(() => {
        this.assetsLoaded = true;
      }, 1000);
      return;
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.assetsLoaded = true;
      }, 1000);
    });

    setTimeout(() => {
      this.assetsLoaded = true;
    }, maxLoadingTime);
  }
}
