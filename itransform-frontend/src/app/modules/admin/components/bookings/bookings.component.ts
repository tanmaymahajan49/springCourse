import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminService, Booking } from '../../services/admin.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatTabsModule
  ],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  displayedColumns: string[] = ['id', 'customer', 'washer', 'service', 'schedule', 'amount', 'status', 'payment', 'actions'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.adminService.getAllBookings().subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  getBookingsByStatus(status: string): Booking[] {
    return this.bookings.filter(booking => booking.status === status);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'confirmed': return 'primary';
      case 'in-progress': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'basic';
    }
  }

  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'paid': return 'primary';
      case 'refunded': return 'accent';
      default: return 'basic';
    }
  }

  getRatingStars(rating?: number): string[] {
    if (!rating) return [];
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    
    if (hasHalfStar) {
      stars.push('star_half');
    }
    
    while (stars.length < 5) {
      stars.push('star_border');
    }
    
    return stars;
  }

  viewBookingDetails(booking: Booking): void {
    console.log('View booking details:', booking);
    // TODO: Implement booking details modal
  }

  updateBookingStatus(booking: Booking, newStatus: string): void {
    console.log('Update booking status:', booking.id, newStatus);
    // TODO: Implement status update functionality
  }

  cancelBooking(booking: Booking): void {
    console.log('Cancel booking:', booking);
    // TODO: Implement booking cancellation
  }

  refundBooking(booking: Booking): void {
    console.log('Refund booking:', booking);
    // TODO: Implement refund functionality
  }

  // Helper method for template
  getTotalRevenue(): number {
    return this.bookings.reduce((sum, b) => sum + b.amount, 0);
  }
}
