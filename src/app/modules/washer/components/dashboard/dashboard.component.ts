import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BookingService, Booking } from '../../../../services/booking.service';
import { AuthService, User } from '../../../../services/auth.service';
import { EmailService } from '../../../../services/email.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatBadgeModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  availableBookings: Booking[] = [];
  myBookings: Booking[] = [];
  completedBookings: Booking[] = [];
  isLoading = false;

  // Dashboard stats
  todayEarnings = 0;
  totalJobs = 0;
  pendingJobs = 0;
  completedJobs = 0;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private emailService: EmailService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadBookings();
    this.calculateStats();
  }

  /**
   * Load all bookings and categorize them
   */
  loadBookings(): void {
    this.isLoading = true;

    // Load available bookings (not assigned to any washer)
    this.bookingService.getAvailableBookings().subscribe(bookings => {
      this.availableBookings = bookings;
      this.isLoading = false;
    });

    // Load washer's assigned bookings
    if (this.currentUser?.id) {
      this.bookingService.getWasherBookings(this.currentUser.id).subscribe(bookings => {
        this.myBookings = bookings.filter(b => b.status === 'ASSIGNED' || b.status === 'IN_PROGRESS');
        this.completedBookings = bookings.filter(b => b.status === 'COMPLETED');
      });
    }
  }

  /**
   * Calculate dashboard statistics
   */
  calculateStats(): void {
    if (this.currentUser?.id) {
      this.bookingService.getWasherBookings(this.currentUser.id).subscribe(bookings => {
        this.totalJobs = bookings.length;
        this.completedJobs = bookings.filter(b => b.status === 'COMPLETED').length;
        this.pendingJobs = bookings.filter(b => b.status === 'ASSIGNED' || b.status === 'IN_PROGRESS').length;

        // Calculate today's earnings
        const today = new Date().toDateString();
        this.todayEarnings = bookings
          .filter(b => b.status === 'COMPLETED' && new Date(b.updatedAt).toDateString() === today)
          .reduce((sum, b) => sum + b.totalAmount, 0);
      });
    }
  }

  /**
   * Accept a booking assignment
   */
  async acceptBooking(booking: Booking): Promise<void> {
    if (!this.currentUser) return;

    try {
      this.isLoading = true;

      // Assign booking to current washer
      const updatedBooking = await this.bookingService.assignBookingToWasher(
        booking.id,
        this.currentUser.id,
        this.currentUser.name,
        this.currentUser.phone
      );

      console.log('✅ Booking assigned successfully:', updatedBooking);

      // Send email notification to customer
      await this.sendBookingAssignedEmail(updatedBooking);

      // Update local data
      this.loadBookings();
      this.calculateStats();

      this.snackBar.open(
        `✅ Booking ${booking.bookingId} accepted! Customer has been notified.`,
        'Close',
        { duration: 5000, panelClass: ['success-snackbar'] }
      );

    } catch (error) {
      console.error('❌ Failed to accept booking:', error);
      this.snackBar.open('Failed to accept booking. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Mark job as completed
   */
  async completeJob(booking: Booking): Promise<void> {
    try {
      this.isLoading = true;

      // Update booking status to completed
      const updatedBooking = await this.bookingService.updateBookingStatus(booking.id, 'COMPLETED');

      console.log('✅ Job completed successfully:', updatedBooking);

      // Send completion email to customer
      await this.sendJobCompletedEmail(updatedBooking);

      // Update local data
      this.loadBookings();
      this.calculateStats();

      this.snackBar.open(
        `🎉 Job completed! Customer has been notified and payment is processed.`,
        'Close',
        { duration: 5000, panelClass: ['success-snackbar'] }
      );

    } catch (error) {
      console.error('❌ Failed to complete job:', error);
      this.snackBar.open('Failed to complete job. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Send booking assigned email to customer
   */
  private async sendBookingAssignedEmail(booking: Booking): Promise<void> {
    const emailData = {
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingId: booking.bookingId,
      serviceName: booking.serviceName,
      servicePrice: booking.servicePrice,
      carDetails: booking.carDetails,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      address: booking.address,
      contactNumber: booking.contactNumber,
      estimatedDuration: booking.estimatedDuration,
      specialInstructions: booking.specialInstructions || '',
      washerName: booking.washerName || '',
      washerPhone: booking.washerPhone || ''
    };

    try {
      await this.emailService.sendBookingAssignedEmail(emailData);
      console.log('📧 Booking assigned email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send booking assigned email:', error);
    }
  }

  /**
   * Send job completed email to customer
   */
  private async sendJobCompletedEmail(booking: Booking): Promise<void> {
    const emailData = {
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingId: booking.bookingId,
      serviceName: booking.serviceName,
      servicePrice: booking.servicePrice,
      carDetails: booking.carDetails,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      address: booking.address,
      contactNumber: booking.contactNumber,
      estimatedDuration: booking.estimatedDuration,
      specialInstructions: booking.specialInstructions || '',
      washerName: booking.washerName || '',
      washerPhone: booking.washerPhone || ''
    };

    try {
      await this.emailService.sendJobCompletedEmail(emailData);
      console.log('📧 Job completed email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send job completed email:', error);
    }
  }

  /**
   * Get status color for booking chips
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'primary';
      case 'ASSIGNED': return 'accent';
      case 'IN_PROGRESS': return 'warn';
      case 'COMPLETED': return 'primary';
      default: return '';
    }
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return 'schedule';
      case 'ASSIGNED': return 'assignment';
      case 'IN_PROGRESS': return 'autorenew';
      case 'COMPLETED': return 'check_circle';
      default: return 'help';
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString()}`;
  }
}
