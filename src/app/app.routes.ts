import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'scm-1',
    loadComponent: () =>
      import('./features/scm1/scm1.component').then((m) => m.Scm1Component),
  },
  {
    path: 'scm-2',
    loadComponent: () =>
      import('./features/scm2/scm2.component').then((m) => m.Scm2Component),
  },
  { path: '**', redirectTo: 'home' },
];
