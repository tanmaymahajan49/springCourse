import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../../services/auth.service';

interface Booking {
  id: number;
  service: string;
  car: string;
  date: string;
  time?: string;
  location?: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}
  recentBookings: Booking[] = [
    {
      id: 1,
      service: 'Premium Wash',
      car: 'Honda City',
      date: 'Dec 15, 2024',
      status: 'Completed'
    },
    {
      id: 2,
      service: 'Basic Wash',
      car: 'Maruti Swift',
      date: 'Dec 10, 2024',
      status: 'Completed'
    },
    {
      id: 3,
      service: 'Deluxe Wash',
      car: 'Honda City',
      date: 'Dec 5, 2024',
      status: 'Completed'
    }
  ];

  upcomingBookings: Booking[] = [
    {
      id: 4,
      service: 'Premium Wash',
      car: 'Honda City',
      date: 'Dec 20, 2024',
      time: '10:00 AM',
      location: 'Bandra West, Mumbai',
      status: 'Confirmed'
    }
  ];

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      // For development: auto-login with a sample email
      const sampleEmail = prompt('Enter your email address:') || 'customer@example.com';
      this.authService.mockAutoLogin(sampleEmail);
      this.currentUser = this.authService.getCurrentUser();
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'primary';
      case 'confirmed':
        return 'accent';
      case 'pending':
        return 'warn';
      case 'cancelled':
        return '';
      default:
        return 'primary';
    }
  }
}
