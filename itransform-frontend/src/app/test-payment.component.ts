import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PaymentService } from './services/payment.service';
import { BookingService } from './services/booking.service';

@Component({
  selector: 'app-test-payment',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  template: `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>🚗 Payment Integration Test</mat-card-title>
          <mat-card-subtitle>Test the Razorpay payment integration with Spring backend</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div style="margin: 20px 0;">
            <h3>Backend Connection Status:</h3>
            <div style="margin: 10px 0;">
              <button mat-raised-button color="accent" (click)="testBackend()" [disabled]="isTestingBackend">
                {{ isTestingBackend ? 'Testing...' : '🔍 Test Spring Backend' }}
              </button>
            </div>
            <div *ngIf="backendStatus" style="margin-top: 10px; padding: 10px; border-radius: 8px;"
                 [style.background]="backendStatus.connected ? '#e8f5e8' : '#ffe8e8'"
                 [style.color]="backendStatus.connected ? '#2e7d32' : '#c62828'">
              <strong>{{ backendStatus.connected ? '✅ Backend Connected' : '❌ Backend Not Connected' }}</strong>
              <p>{{ backendStatus.message }}</p>
            </div>
          </div>

          <div style="margin: 20px 0;">
            <h3>Test Booking Details:</h3>
            <p><strong>Service:</strong> Premium Car Wash</p>
            <p><strong>Amount:</strong> ₹599</p>
            <p><strong>Car:</strong> 2022 Honda City</p>
            <p><strong>Customer:</strong> Test Customer</p>
            <p><strong>Backend URLs:</strong></p>
            <ul>
              <li>PaymentGateway: http://localhost:8090/payments</li>
              <li>Payment Service: http://localhost:8085/payments</li>
            </ul>
          </div>

          <div style="margin: 20px 0;">
            <button mat-raised-button color="primary" (click)="testPayment()" [disabled]="isProcessing">
              {{ isProcessing ? 'Processing...' : '💳 Test Real Razorpay Payment' }}
            </button>
          </div>

          <div *ngIf="result" style="margin-top: 20px; padding: 15px; border-radius: 8px;"
               [style.background]="result.success ? '#e8f5e8' : '#ffe8e8'"
               [style.color]="result.success ? '#2e7d32' : '#c62828'">
            <h4>{{ result.success ? '✅ Success!' : '❌ Failed!' }}</h4>
            <p>{{ result.message }}</p>
            <div *ngIf="result.paymentId">
              <strong>Payment ID:</strong> {{ result.paymentId }}
            </div>
            <div *ngIf="result.bookingId">
              <strong>Booking ID:</strong> {{ result.bookingId }}
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class TestPaymentComponent {
  isProcessing = false;
  isTestingBackend = false;
  result: any = null;
  backendStatus: any = null;

  constructor(
    private paymentService: PaymentService,
    private bookingService: BookingService
  ) {}

  testBackend(): void {
    this.isTestingBackend = true;
    this.backendStatus = null;

    console.log('🔍 Testing Spring backend connection...');

    this.paymentService.testBackendConnection().subscribe({
      next: (connected) => {
        this.backendStatus = {
          connected: connected,
          message: connected
            ? 'Spring backend services are running and accessible!'
            : 'Spring backend services are not accessible. Please check if they are running on ports 8085 and 8090.'
        };
        this.isTestingBackend = false;
      },
      error: (error) => {
        console.error('❌ Backend test error:', error);
        this.backendStatus = {
          connected: false,
          message: `Connection failed: ${error.message || 'Unknown error'}. Please ensure Spring backend services are running.`
        };
        this.isTestingBackend = false;
      }
    });
  }

  testPayment(): void {
    this.isProcessing = true;
    this.result = null;

    const testBookingRequest = {
      customerId: 'test_customer_001',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+91 9876543210',
      carId: 'test_car_001',
      carDetails: {
        make: 'Honda',
        model: 'City',
        year: 2022,
        color: 'White',
        licensePlate: 'MH01AB1234'
      },
      serviceType: 'Premium Wash',
      servicePackage: 'Complete interior and exterior cleaning',
      scheduledDate: new Date(),
      scheduledTime: '10:00 AM',
      address: 'Test Address, Mumbai',
      amount: 599
    };

    console.log('🚀 Starting payment test...');

    this.bookingService.createBookingWithPayment(testBookingRequest).subscribe({
      next: (response) => {
        console.log('✅ Payment test result:', response);
        this.result = response;
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('❌ Payment test error:', error);
        this.result = {
          success: false,
          message: 'Payment test failed: ' + error.message
        };
        this.isProcessing = false;
      }
    });
  }
}
