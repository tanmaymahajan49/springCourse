import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  selectedUserType: string = 'customer';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Check if there's a preferred role from navigation
    if (typeof window !== 'undefined' && window.localStorage) {
      const preferredRole = localStorage.getItem('preferredRole');
      if (preferredRole && ['customer', 'washer', 'admin'].includes(preferredRole)) {
        this.selectedUserType = preferredRole;
        localStorage.removeItem('preferredRole');
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      // Use AuthService for role-based login
      this.authService.login(credentials, this.selectedUserType as 'customer' | 'washer' | 'admin')
        .then(user => {
          console.log('✅ Login successful:', user);

          // Check if there's a redirect URL stored
          let redirectUrl = null;
          if (typeof window !== 'undefined' && window.localStorage) {
            redirectUrl = localStorage.getItem('redirectUrl');
            if (redirectUrl) {
              localStorage.removeItem('redirectUrl');
            }
          }

          if (redirectUrl) {
            this.router.navigate([redirectUrl]);
          } else {
            // Navigate to appropriate dashboard based on role
            const dashboardRoute = this.authService.getDashboardRoute(user.role);
            this.router.navigate([dashboardRoute]);
          }
        })
        .catch(error => {
          console.error('❌ Login failed:', error);
          alert('Login failed. Please check your credentials.');
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  /**
   * Quick test method to bypass login and go directly to washer dashboard
   */
  quickTestWasher(): void {
    console.log('🚀 Quick test: Going to washer dashboard');

    // Create a mock washer user
    const mockWasher = {
      id: 'washer_test_' + Date.now(),
      name: 'Test Washer',
      email: 'washer@test.com',
      phone: '+91 9876543210',
      role: 'washer' as const,
      address: 'Service Area: Mumbai, Pune, Nashik'
    };

    // Set the user in auth service
    this.authService.setCurrentUser(mockWasher);

    // Navigate to washer dashboard
    this.router.navigate(['/washer']);
  }
}
