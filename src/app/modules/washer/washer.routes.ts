import { Routes } from '@angular/router';

export const washerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/washer-dashboard/washer-dashboard.component').then(m => m.WasherDashboardComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'my-jobs', loadComponent: () => import('./components/my-jobs/my-jobs.component').then(m => m.MyJobsComponent) },
      { path: 'earnings', loadComponent: () => import('./components/earnings/earnings.component').then(m => m.EarningsComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];
