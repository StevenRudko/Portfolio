import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import emailjs from '@emailjs/browser';
import { translations } from '../hero/navbar/translations';

/**
 * Custom validator for strict email format
 */
export function strictEmailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);

    return valid ? null : { strictEmail: true };
  };
}

/**
 * Contact form component with email functionality
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit, AfterViewInit {
  @ViewChild('contactSection') contactSection!: ElementRef;
  @ViewChild('contactContent') contactContent!: ElementRef;

  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  currentLang: string = 'en';
  formValid = false;

  private errorMessages: { [key: string]: { [key: string]: string } } = {
    name: {
      en: 'Please enter your name',
      de: 'Bitte gib deinen Namen ein',
    },
    email: {
      en: 'Please enter a valid email address',
      de: 'Bitte gib eine gültige E-Mail-Adresse ein',
    },
    strictEmail: {
      en: 'Email must include a valid domain (e.g. .com, .de)',
      de: 'E-Mail muss eine gültige Domain enthalten (z.B. .com, .de)',
    },
    message: {
      en: 'Please enter your message (at least 10 characters)',
      de: 'Bitte gib deine Nachricht ein (mindestens 10 Zeichen)',
    },
    privacyPolicy: {
      en: 'Please accept the privacy policy',
      de: 'Bitte akzeptiere die Datenschutzerklärung',
    },
  };

  private placeholders: { [key: string]: { [key: string]: string } } = {
    name_placeholder: {
      en: 'Your name goes here',
      de: 'Dein Name hier',
    },
    message_placeholder: {
      en: 'Hello Steven, I am interested in...',
      de: 'Hallo Steven, ich interessiere mich für...',
    },
  };

  constructor(private fb: FormBuilder) {}

  /**
   * Initializes the contact form with validators and language listener
   */
  ngOnInit() {
    this.initContactForm();
    this.setupLanguageListener();
    this.monitorFormValidity();
  }

  /**
   * Initializes the contact form with validation
   */
  private initContactForm() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.email, strictEmailValidator()],
      ],
      message: ['', [Validators.required, Validators.minLength(10)]],
      privacyPolicy: [false, Validators.requiredTrue],
    });
  }

  /**
   * Sets up listener for language changes
   */
  private setupLanguageListener() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLang = savedLang;
    }

    window.addEventListener('languageChanged', (event: Event) => {
      const customEvent = event as CustomEvent;
      this.currentLang = customEvent.detail;
    });
  }

  /**
   * Monitors form validity to enable/disable submit button
   */
  private monitorFormValidity() {
    this.contactForm.statusChanges.subscribe((status) => {
      this.formValid = status === 'VALID';
    });
  }

  /**
   * Sets up the intersection observer for section animation
   */
  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.05,
    };

    const sectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options
    );
    sectionObserver.observe(this.contactSection.nativeElement);
  }

  /**
   * Handles intersection observation events
   */
  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          this.contactContent.nativeElement.classList.add('animate-in');
        }, 100);

        const observer = new IntersectionObserver(() => {}, {});
        observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Gets appropriate error message based on field and language
   */
  getErrorMessage(fieldName: string): string {
    const control = this.contactForm.get(fieldName);

    if (fieldName === 'email' && control?.errors?.['strictEmail']) {
      return (
        this.errorMessages['strictEmail'][this.currentLang] ||
        this.errorMessages['strictEmail']['en']
      );
    }

    if (this.errorMessages[fieldName]) {
      return (
        this.errorMessages[fieldName][this.currentLang] ||
        this.errorMessages[fieldName]['en']
      );
    }
    return '';
  }

  /**
   * Gets placeholder text based on field and language
   */
  getPlaceholder(key: string): string {
    if (this.placeholders[key]) {
      return (
        this.placeholders[key][this.currentLang] || this.placeholders[key]['en']
      );
    }
    return '';
  }

  /**
   * Gets translation from translations object with type safety
   */
  getTranslation(key: string): string {
    if (this.currentLang === 'de') {
      const typedKey = key as keyof typeof translations.de;
      if (translations.de[typedKey]) {
        return translations.de[typedKey];
      }
    }

    const element = document.querySelector(`[data-translate="${key}"]`);
    return element?.innerHTML || '';
  }

  /**
   * Handles form submission and sends email via EmailJS
   */
  onSubmit() {
    if (this.validateForm()) {
      this.sendEmail();
    }
  }

  /**
   * Validates the form before submission
   */
  private validateForm(): boolean {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return false;
    }
    return true;
  }

  /**
   * Sends email using EmailJS service
   */
  private sendEmail() {
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const templateParams = {
      from_name: this.contactForm.value.name,
      from_email: this.contactForm.value.email,
      message: this.contactForm.value.message,
      to_email: 'steven.rudko@outlook.com',
    };

    const serviceId = 'service_mhcdzmi';
    const templateId = 'template_bz2g86a';
    const publicKey = 'ZHAJgfBA8zBgg8JrJ';

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(
        this.handleEmailSuccess.bind(this),
        this.handleEmailError.bind(this)
      );
  }

  /**
   * Handles successful email submission
   */
  private handleEmailSuccess() {
    this.isSubmitting = false;
    this.submitSuccess = true;
    this.resetForm();
  }

  /**
   * Handles email submission error
   */
  private handleEmailError() {
    this.isSubmitting = false;
    this.submitError = true;
  }

  /**
   * Resets form after successful submission
   */
  private resetForm() {
    this.contactForm.reset();
    Object.keys(this.contactForm.controls).forEach((key) => {
      const control = this.contactForm.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
    this.contactForm.get('privacyPolicy')?.setValue(false);
  }

  /**
   * Returns CSS classes for form field validation states
   */
  getFieldClass(fieldName: string) {
    const control = this.contactForm.get(fieldName);
    return {
      invalid: control && control.invalid && control.touched,
      valid: control && control.valid && control.touched,
    };
  }
}
