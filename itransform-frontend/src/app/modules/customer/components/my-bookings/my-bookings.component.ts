import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';
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
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}
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

    // Navigate to book service page with pre-filled data
    this.router.navigate(['/customer/book-service'], {
      queryParams: {
        reschedule: true,
        bookingId: booking.id,
        service: booking.service,
        car: booking.car
      }
    });

    this.notificationService.showInfo(
      `Redirecting to reschedule booking #${booking.id}`,
      'OK',
      3000
    );
  }

  cancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      // Update booking status
      booking.status = 'Cancelled';
      this.categorizeBookings();

      // Show success notification
      this.notificationService.showSuccess(
        `Booking #${booking.id} has been cancelled successfully`,
        'OK',
        5000
      );

      // In a real app, this would make an API call to cancel the booking
      console.log('Booking cancelled:', booking.id);
    }
  }

  rateService(booking: Booking): void {
    console.log('Rate service:', booking.id);

    // In a real app, this would open a rating dialog
    this.notificationService.showInfo(
      'Rating feature coming soon! Thank you for your feedback.',
      'OK',
      4000
    );
  }

  rebookService(booking: Booking): void {
    console.log('Rebook service:', booking.id);

    // Navigate to booking page with pre-filled data
    this.router.navigate(['/customer/book-service'], {
      queryParams: {
        rebook: true,
        previousBookingId: booking.id,
        service: booking.service,
        car: booking.car
      }
    });

    this.notificationService.showInfo(
      `Redirecting to book ${booking.service} again`,
      'OK',
      3000
    );
  }

  contactWasher(booking: Booking): void {
    console.log('Contact washer for booking:', booking.id);
    this.notificationService.showInfo(
      'Contacting washer feature coming soon!',
      'OK',
      3000
    );
  }

  getDirections(booking: Booking): void {
    console.log('Get directions for booking:', booking.id);
    if (booking.location) {
      // In a real app, this would open maps with directions
      this.notificationService.showInfo(
        `Opening directions to ${booking.location}`,
        'OK',
        3000
      );
    } else {
      this.notificationService.showWarning(
        'Location not available for this booking',
        'OK',
        3000
      );
    }
  }

  downloadInvoice(booking: Booking): void {
    console.log('Download invoice for booking:', booking.id);
    this.notificationService.showInfo(
      `Downloading invoice for booking #${booking.id}`,
      'OK',
      3000
    );
    // In a real app, this would download the invoice PDF
  }

  reportIssue(booking: Booking): void {
    console.log('Report issue for booking:', booking.id);
    this.notificationService.showInfo(
      'Issue reporting feature coming soon!',
      'OK',
      3000
    );
    // In a real app, this would open a support form
  }
}
