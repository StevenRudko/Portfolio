import { Routes } from '@angular/router';
import { PrivacyPolicyPageComponent } from './components/privacy-policy/privacy-policy.component';
import { LegalNoticePageComponent } from './components/legal-notice/legal-notice.component';

export const routes: Routes = [
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
  { path: 'legal-notice', component: LegalNoticePageComponent },
  { path: '**', redirectTo: '' },
];
