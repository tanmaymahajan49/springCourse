import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();
    
    if (!isLoggedIn || !currentUser) {
      // Store the attempted URL for redirecting after login
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('redirectUrl', state.url);
      }
      this.router.navigate(['/login']);
      return false;
    }

    // Check role-based access
    const requiredRole = this.getRequiredRole(state.url);
    if (requiredRole && currentUser.role !== requiredRole) {
      // Redirect to appropriate dashboard for user's role
      const userDashboard = this.authService.getDashboardRoute(currentUser.role);
      this.router.navigate([userDashboard]);
      return false;
    }

    return true;
  }

  private getRequiredRole(url: string): string | null {
    if (url.startsWith('/customer')) {
      return 'customer';
    } else if (url.startsWith('/washer')) {
      return 'washer';
    } else if (url.startsWith('/admin')) {
      return 'admin';
    }
    return null;
  }
}
