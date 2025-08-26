import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

interface Booking {
  id: string;
  service: string;
  car: string;
  date: string;
  time: string;
  location: string;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  price: number;
  washer?: string;
  bookingDate: Date;
}

@Component({
  selector: 'app-my-bookings',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  allBookings: Booking[] = [
    {
      id: 'BK001',
      service: 'Premium Wash',
      car: 'Honda City',
      date: '2024-12-20',
      time: '10:00 AM',
      location: 'Bandra West, Mumbai',
      status: 'Confirmed',
      price: 599,
      washer: 'Rajesh Kumar',
      bookingDate: new Date('2024-12-18')
    },
    {
      id: 'BK002',
      service: 'Basic Wash',
      car: 'Maruti Swift',
      date: '2024-12-15',
      time: '02:00 PM',
      location: 'Andheri East, Mumbai',
      status: 'Completed',
      price: 299,
      washer: 'Suresh Patel',
      bookingDate: new Date('2024-12-13')
    },
    {
      id: 'BK003',
      service: 'Deluxe Detailing',
      car: 'Honda City',
      date: '2024-12-10',
      time: '11:00 AM',
      location: 'Powai, Mumbai',
      status: 'Completed',
      price: 999,
      washer: 'Amit Singh',
      bookingDate: new Date('2024-12-08')
    },
    {
      id: 'BK004',
      service: 'Premium Wash',
      car: 'Maruti Swift',
      date: '2024-12-05',
      time: '09:00 AM',
      location: 'Bandra West, Mumbai',
      status: 'Cancelled',
      price: 599,
      bookingDate: new Date('2024-12-03')
    }
  ];

  upcomingBookings: Booking[] = [];
  completedBookings: Booking[] = [];
  cancelledBookings: Booking[] = [];

  ngOnInit(): void {
    this.categorizeBookings();
  }

  categorizeBookings(): void {
    const today = new Date();

    this.upcomingBookings = this.allBookings.filter(booking =>
      booking.status === 'Confirmed' || booking.status === 'In Progress'
    );

    this.completedBookings = this.allBookings.filter(booking =>
      booking.status === 'Completed'
    );

    this.cancelledBookings = this.allBookings.filter(booking =>
      booking.status === 'Cancelled'
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Confirmed': return 'primary';
      case 'In Progress': return 'accent';
      case 'Completed': return 'primary';
      case 'Cancelled': return 'warn';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Confirmed': return 'schedule';
      case 'In Progress': return 'autorenew';
      case 'Completed': return 'check_circle';
      case 'Cancelled': return 'cancel';
      default: return 'help';
    }
  }

  rescheduleBooking(booking: Booking): void {
    console.log('Reschedule booking:', booking.id);
    // Implement reschedule logic
  }

  cancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      booking.status = 'Cancelled';
      this.categorizeBookings();
    }
  }

  rateService(booking: Booking): void {
    console.log('Rate service:', booking.id);
    // Implement rating logic
  }

  rebookService(booking: Booking): void {
    console.log('Rebook service:', booking.id);
    // Navigate to booking page with pre-filled data
  }
}
