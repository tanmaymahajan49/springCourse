import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'book-service', loadComponent: () => import('./components/book-service/book-service.component').then(m => m.BookServiceComponent) },
      { path: 'my-bookings', loadComponent: () => import('./components/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent) },
      { path: 'my-cars', loadComponent: () => import('./components/my-cars/my-cars.component').then(m => m.MyCarsComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  }
];
