import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'waf-policy',
    loadComponent: () =>
      import('./features/waf-policy/waf-policy.component').then(
        (m) => m.WafPolicyComponent,
      ),
  },
  {
    path: 'waf-policy2',
    loadComponent: () =>
      import('./features/waf-policy2/waf-policy2.component').then(
        (m) => m.WafPolicy2Component,
      ),
  },
  {
    path: 'ips-policy-summary',
    loadComponent: () =>
      import('./features/ips-policy-summary/ips-policy-summary.component').then(
        (m) => m.IpsPolicySummaryComponent,
      ),
  },
  {
    path: 'waf-ips-summary',
    loadComponent: () =>
      import('./features/waf-ips-summary/waf-ips-summary.component').then(
        (m) => m.WafIpsSummaryComponent,
      ),
  },
  {
    path: 'waf-ips-summary2',
    loadComponent: () =>
      import('./features/waf-ips-summary2/waf-ips-summary2.component').then(
        (m) => m.WafIpsSummary2Component,
      ),
  },
  { path: '**', redirectTo: 'home' },
];
