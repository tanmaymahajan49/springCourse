import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookingConfirmationData } from '../../services/email.service';

@Component({
  selector: 'app-email-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="email-preview">
      <div class="email-header">
        <h2 mat-dialog-title>📧 Email Preview</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div mat-dialog-content class="email-content">
        <div class="email-template">
          <!-- Email Header -->
          <div class="email-template-header">
            <h1>🚗 iTransform Car Wash</h1>
            <p class="tagline">Professional Car Care Services</p>
          </div>
          
          <!-- Email Body -->
          <div class="email-template-body">
            <h2>🎉 Booking Confirmation</h2>
            
            <p>Dear {{ data.customerName }},</p>
            
            <p>Thank you for choosing iTransform Car Wash! Your booking has been confirmed.</p>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">{{ data.bookingId }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">{{ data.serviceName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Price:</span>
                <span class="value">₹{{ data.servicePrice }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Vehicle:</span>
                <span class="value">{{ data.carDetails }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">{{ data.scheduledDate }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">{{ data.scheduledTime }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{ data.estimatedDuration }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Location:</span>
                <span class="value">{{ data.address }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Contact:</span>
                <span class="value">{{ data.contactNumber }}</span>
              </div>
              <div class="detail-row" *ngIf="data.specialInstructions">
                <span class="label">Special Instructions:</span>
                <span class="value">{{ data.specialInstructions }}</span>
              </div>
            </div>
            
            <div class="next-steps">
              <h3>📱 What's Next?</h3>
              <ul>
                <li>Our team will arrive at your location on the scheduled date and time</li>
                <li>Please ensure your vehicle is accessible</li>
                <li>You'll receive an SMS reminder 1 hour before the service</li>
                <li>Payment can be made after service completion</li>
              </ul>
            </div>
            
            <div class="contact-info">
              <h3>📞 Need Help?</h3>
              <p>Contact us at:</p>
              <p>📧 support&#64;itransform.com</p>
              <p>📱 +91 9876543210</p>
            </div>
          </div>
          
          <!-- Email Footer -->
          <div class="email-template-footer">
            <p>Thank you for choosing iTransform Car Wash!</p>
            <p class="small-text">This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
      
      <div mat-dialog-actions class="email-actions">
        <button mat-button (click)="close()">Close Preview</button>
        <button mat-raised-button color="primary" (click)="close()">
          <mat-icon>check</mat-icon>
          Looks Good!
        </button>
      </div>
    </div>
  `,
  styles: [`
    .email-preview {
      max-width: 600px;
      max-height: 80vh;
    }
    
    .email-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    
    .email-content {
      max-height: 60vh;
      overflow-y: auto;
    }
    
    .email-template {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
    
    .email-template-header {
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
      padding: 24px;
      text-align: center;
      
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: bold;
      }
      
      .tagline {
        margin: 8px 0 0 0;
        opacity: 0.9;
        font-size: 14px;
      }
    }
    
    .email-template-body {
      padding: 24px;
      
      h2 {
        color: #1976d2;
        margin-top: 0;
      }
      
      h3 {
        color: #333;
        margin-top: 24px;
        margin-bottom: 12px;
      }
    }
    
    .booking-details {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .label {
          font-weight: 500;
          color: #666;
        }
        
        .value {
          font-weight: 600;
          color: #333;
        }
      }
    }
    
    .next-steps {
      ul {
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
          line-height: 1.5;
        }
      }
    }
    
    .contact-info {
      background: #e3f2fd;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
      
      p {
        margin: 4px 0;
      }
    }
    
    .email-template-footer {
      background: #f5f5f5;
      padding: 16px 24px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      
      p {
        margin: 4px 0;
      }
      
      .small-text {
        font-size: 12px;
        color: #666;
      }
    }
    
    .email-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class EmailPreviewComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookingConfirmationData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
