import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
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

  constructor(private router: Router, private titleService: Title) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEvent = event as NavigationEnd;
        this.isHomePage = navigationEvent.urlAfterRedirects === '/';

        if (this.isHomePage) {
          this.titleService.setTitle('Steven Rudko | Portfolio');
        }

        if (!this.isHomePage) {
          window.scrollTo(0, 0);
        }
      });
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
   * Starts loading process with a safety fallback
   */
  private startLoading() {
    const maxLoadingTime = 5000;

    if (document.readyState === 'complete') {
      setTimeout(() => {
        this.assetsLoaded = true;
      }, 1000);
    } else {
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
}
