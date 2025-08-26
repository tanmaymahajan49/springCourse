import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'customer',
    loadComponent: () => import('./modules/customer/components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./modules/customer/components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'book-service', loadComponent: () => import('./modules/customer/components/book-service/book-service.component').then(m => m.BookServiceComponent) },
      { path: 'my-bookings', loadComponent: () => import('./modules/customer/components/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent) },
      // { path: 'my-cars', loadComponent: () => import('./modules/customer/components/my-cars/my-cars.component').then(m => m.MyCarsComponent) },
      // { path: 'profile', loadComponent: () => import('./modules/customer/components/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },
  {
    path: 'washer',
    loadComponent: () => import('./components/washer-dashboard/washer-dashboard.component').then(m => m.WasherDashboardComponent),
    canActivate: [AuthGuard]
  },
  // Admin routes (temporarily disabled due to compilation issues)
  // {
  //   path: 'admin',
  //   loadComponent: () => import('./modules/admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: '', redirectTo: 'overview', pathMatch: 'full' },
  //     { path: 'overview', loadComponent: () => import('./modules/admin/components/overview/overview.component').then(m => m.OverviewComponent) },
  //     { path: 'customers', loadComponent: () => import('./modules/admin/components/customers/customers.component').then(m => m.CustomersComponent) },
  //     { path: 'washers', loadComponent: () => import('./modules/admin/components/washers/washers.component').then(m => m.WashersComponent) },
  //     { path: 'bookings', loadComponent: () => import('./modules/admin/components/bookings/bookings.component').then(m => m.BookingsComponent) },
  //     { path: 'analytics', loadComponent: () => import('./modules/admin/components/analytics/analytics.component').then(m => m.AnalyticsComponent) },
  //     { path: 'settings', loadComponent: () => import('./modules/admin/components/settings/settings.component').then(m => m.SettingsComponent) }
  //   ]
  // },

  // Test payment route
  {
    path: 'test-payment',
    loadComponent: () => import('./test-payment.component').then(m => m.TestPaymentComponent)
  },
  { path: '**', redirectTo: '/home' }
];
