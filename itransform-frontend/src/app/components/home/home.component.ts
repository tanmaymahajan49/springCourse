import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Clean theme properties
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Handle Book Now button click
   */
  onBookNow(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.role === 'customer') {
      // User is already logged in as customer, go to dashboard
      this.router.navigate(['/customer']);
    } else {
      // Redirect to login with customer preference
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('redirectUrl', '/customer');
        localStorage.setItem('preferredRole', 'customer');
      }
      this.router.navigate(['/login']);
    }
  }

  /**
   * Handle Join as Washer button click
   */
  onJoinAsWasher(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.role === 'washer') {
      // User is already logged in as washer, go to dashboard
      this.router.navigate(['/washer']);
    } else {
      // Redirect to login with washer preference
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('redirectUrl', '/washer');
        localStorage.setItem('preferredRole', 'washer');
      }
      this.router.navigate(['/login']);
    }
  }
}
