import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface NotificationConfig {
  message: string;
  action?: string;
  duration?: number;
  panelClass?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show success notification
   */
  showSuccess(message: string, action: string = 'Close', duration: number = 5000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Show error notification
   */
  showError(message: string, action: string = 'Close', duration: number = 7000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Show warning notification
   */
  showWarning(message: string, action: string = 'Close', duration: number = 6000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Show info notification
   */
  showInfo(message: string, action: string = 'Close', duration: number = 4000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Show custom notification
   */
  showCustom(config: NotificationConfig): void {
    this.snackBar.open(config.message, config.action || 'Close', {
      duration: config.duration || 4000,
      panelClass: config.panelClass || [],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Show booking confirmation notification
   */
  showBookingConfirmation(bookingId: string, email: string): void {
    this.showSuccess(
      `🎉 Booking confirmed! Confirmation email sent to ${email}`,
      'View Booking',
      8000
    );
  }

  /**
   * Show email sending notification
   */
  showEmailSending(): void {
    this.showInfo('📧 Sending confirmation email...', '', 2000);
  }

  /**
   * Show email sent notification
   */
  showEmailSent(email: string): void {
    this.showSuccess(`✅ Confirmation email sent to ${email}`, 'OK', 5000);
  }

  /**
   * Show email failed notification
   */
  showEmailFailed(): void {
    this.showError('❌ Failed to send confirmation email. Please contact support.', 'Retry', 8000);
  }
}
