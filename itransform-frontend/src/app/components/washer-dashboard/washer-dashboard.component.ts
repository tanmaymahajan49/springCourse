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

interface Booking {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  servicePrice: number;
  carDetails: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: string;
  address: string;
  contactNumber: string;
  specialInstructions?: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  washerName?: string;
  washerPhone?: string;
}

@Component({
  selector: 'app-washer-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatBadgeModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="washer-dashboard">
      <!-- Header Section -->
      <div class="dashboard-header">
        <mat-card class="welcome-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>work</mat-icon>
              Welcome, Test Washer!
            </mat-card-title>
            <mat-card-subtitle>Washer Dashboard - Manage your bookings and jobs</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <div class="stats-grid">
          <mat-card class="stat-card earnings">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon earnings-icon">
                  <mat-icon>account_balance_wallet</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>₹{{ todayEarnings }}</h3>
                  <p>Today's Earnings</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card total-jobs">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon jobs-icon">
                  <mat-icon>work</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ totalJobs }}</h3>
                  <p>Total Jobs</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card pending">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon pending-icon">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ pendingJobs }}</h3>
                  <p>Pending Jobs</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card completed">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon completed-icon">
                  <mat-icon>check_circle</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ completedJobs }}</h3>
                  <p>Completed Jobs</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <div class="main-content">
        <mat-tab-group class="booking-tabs" animationDuration="300ms">
          
          <!-- Available Bookings Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>assignment</mat-icon>
              Available Bookings
              <mat-chip-set *ngIf="availableBookings.length > 0">
                <mat-chip color="primary">{{ availableBookings.length }}</mat-chip>
              </mat-chip-set>
            </ng-template>

            <div class="tab-content">
              <div class="section-header">
                <h2>🚗 Available Bookings</h2>
                <p>Select bookings you want to take up</p>
              </div>

              <div *ngIf="availableBookings.length === 0" class="empty-state">
                <mat-icon>assignment_turned_in</mat-icon>
                <h3>No Available Bookings</h3>
                <p>All bookings are currently assigned. Check back later!</p>
              </div>

              <div class="bookings-grid" *ngIf="availableBookings.length > 0">
                <mat-card *ngFor="let booking of availableBookings" class="booking-card available">
                  <mat-card-header>
                    <mat-card-title>
                      <div class="booking-title">
                        <span>{{ booking.bookingId }}</span>
                        <mat-chip color="primary">
                          <mat-icon>schedule</mat-icon>
                          {{ booking.status }}
                        </mat-chip>
                      </div>
                    </mat-card-title>
                    <mat-card-subtitle>{{ booking.serviceName }}</mat-card-subtitle>
                  </mat-card-header>

                  <mat-card-content>
                    <div class="booking-details">
                      <div class="detail-row">
                        <mat-icon>person</mat-icon>
                        <span><strong>Customer:</strong> {{ booking.customerName }}</span>
                      </div>
                      <div class="detail-row">
                        <mat-icon>directions_car</mat-icon>
                        <span><strong>Vehicle:</strong> {{ booking.carDetails }}</span>
                      </div>
                      <div class="detail-row">
                        <mat-icon>schedule</mat-icon>
                        <span><strong>Time:</strong> {{ booking.scheduledDate }} at {{ booking.scheduledTime }}</span>
                      </div>
                      <div class="detail-row">
                        <mat-icon>location_on</mat-icon>
                        <span><strong>Location:</strong> {{ booking.address }}</span>
                      </div>
                      <div class="detail-row">
                        <mat-icon>phone</mat-icon>
                        <span><strong>Contact:</strong> {{ booking.contactNumber }}</span>
                      </div>
                      <div class="detail-row price-row">
                        <mat-icon>currency_rupee</mat-icon>
                        <span class="price"><strong>Amount:</strong> ₹{{ booking.servicePrice }}</span>
                      </div>
                      <div *ngIf="booking.specialInstructions" class="detail-row">
                        <mat-icon>note</mat-icon>
                        <span><strong>Instructions:</strong> {{ booking.specialInstructions }}</span>
                      </div>
                    </div>
                  </mat-card-content>

                  <mat-card-actions>
                    <button mat-raised-button color="primary" (click)="acceptBooking(booking)">
                      <mat-icon>assignment_turned_in</mat-icon>
                      Accept Booking
                    </button>
                    <button mat-button>
                      <mat-icon>info</mat-icon>
                      View Details
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- My Jobs Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>work</mat-icon>
              My Jobs
              <mat-chip-set *ngIf="myBookings.length > 0">
                <mat-chip color="accent">{{ myBookings.length }}</mat-chip>
              </mat-chip-set>
            </ng-template>

            <div class="tab-content">
              <div class="section-header">
                <h2>🔧 My Active Jobs</h2>
                <p>Jobs assigned to you - mark as complete when done</p>
              </div>

              <div *ngIf="myBookings.length === 0" class="empty-state">
                <mat-icon>work_off</mat-icon>
                <h3>No Active Jobs</h3>
                <p>Accept some bookings from the Available Bookings tab!</p>
              </div>

              <div class="bookings-grid" *ngIf="myBookings.length > 0">
                <mat-card *ngFor="let booking of myBookings" class="booking-card my-job">
                  <mat-card-header>
                    <mat-card-title>
                      <div class="booking-title">
                        <span>{{ booking.bookingId }}</span>
                        <mat-chip color="accent">
                          <mat-icon>autorenew</mat-icon>
                          {{ booking.status }}
                        </mat-chip>
                      </div>
                    </mat-card-title>
                    <mat-card-subtitle>{{ booking.serviceName }}</mat-card-subtitle>
                  </mat-card-header>

                  <mat-card-content>
                    <div class="booking-details">
                      <div class="detail-row">
                        <mat-icon>person</mat-icon>
                        <span><strong>Customer:</strong> {{ booking.customerName }}</span>
                      </div>
                      <div class="detail-row">
                        <mat-icon>directions_car</mat-icon>
                        <span><strong>Vehicle:</strong> {{ booking.carDetails }}</span>
                      </div>
                      <div class="detail-row">
                        <mat-icon>schedule</mat-icon>
                        <span><strong>Time:</strong> {{ booking.scheduledDate }} at {{ booking.scheduledTime }}</span>
                      </div>
                      <div class="detail-row">
                        <mat-icon>location_on</mat-icon>
                        <span><strong>Location:</strong> {{ booking.address }}</span>
                      </div>
                      <div class="detail-row price-row">
                        <mat-icon>currency_rupee</mat-icon>
                        <span class="price"><strong>Earning:</strong> ₹{{ booking.servicePrice }}</span>
                      </div>
                    </div>
                  </mat-card-content>

                  <mat-card-actions>
                    <button mat-raised-button color="primary" (click)="completeJob(booking)">
                      <mat-icon>check_circle</mat-icon>
                      Mark as Complete
                    </button>
                    <button mat-button color="accent">
                      <mat-icon>call</mat-icon>
                      Call Customer
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Completed Jobs Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>history</mat-icon>
              Completed Jobs
              <mat-chip-set *ngIf="completedBookings.length > 0">
                <mat-chip color="primary">{{ completedBookings.length }}</mat-chip>
              </mat-chip-set>
            </ng-template>

            <div class="tab-content">
              <div class="section-header">
                <h2>✅ Completed Jobs</h2>
                <p>Your job history and earnings</p>
              </div>

              <div *ngIf="completedBookings.length === 0" class="empty-state">
                <mat-icon>history</mat-icon>
                <h3>No Completed Jobs Yet</h3>
                <p>Complete your first job to see it here!</p>
              </div>

              <div class="bookings-grid" *ngIf="completedBookings.length > 0">
                <mat-card *ngFor="let booking of completedBookings" class="booking-card completed">
                  <mat-card-header>
                    <mat-card-title>
                      <div class="booking-title">
                        <span>{{ booking.bookingId }}</span>
                        <mat-chip color="primary">
                          <mat-icon>check_circle</mat-icon>
                          {{ booking.status }}
                        </mat-chip>
                      </div>
                    </mat-card-title>
                    <mat-card-subtitle>{{ booking.serviceName }}</mat-card-subtitle>
                  </mat-card-header>

                  <mat-card-content>
                    <div class="booking-details">
                      <div class="detail-row">
                        <mat-icon>person</mat-icon>
                        <span><strong>Customer:</strong> {{ booking.customerName }}</span>
                      </div>
                      <div class="detail-row">
                        <mat-icon>directions_car</mat-icon>
                        <span><strong>Vehicle:</strong> {{ booking.carDetails }}</span>
                      </div>
                      <div class="detail-row price-row">
                        <mat-icon>currency_rupee</mat-icon>
                        <span class="price"><strong>Earned:</strong> ₹{{ booking.servicePrice }}</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .washer-dashboard {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.5;
    }

    .dashboard-header .welcome-card {
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
      margin-bottom: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .welcome-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .welcome-card mat-card-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin-top: 8px;
      font-weight: 400;
    }

    .stats-section {
      margin-bottom: 30px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .stat-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 12px;
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 16px;
      min-height: 80px;
    }

    .stat-content .stat-icon {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
    }

    .stat-content .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #666;
    }

    .earnings-icon {
      background: rgba(76, 175, 80, 0.1) !important;
    }

    .earnings-icon mat-icon {
      color: #4caf50 !important;
    }

    .jobs-icon {
      background: rgba(33, 150, 243, 0.1) !important;
    }

    .jobs-icon mat-icon {
      color: #2196f3 !important;
    }

    .pending-icon {
      background: rgba(255, 152, 0, 0.1) !important;
    }

    .pending-icon mat-icon {
      color: #ff9800 !important;
    }

    .completed-icon {
      background: rgba(156, 39, 176, 0.1) !important;
    }

    .completed-icon mat-icon {
      color: #9c27b0 !important;
    }

    .stat-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .stat-info h3 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
      letter-spacing: 0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stat-info p {
      margin: 0;
      color: #666;
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }

    .earnings { border-left: 4px solid #4caf50; }
    .total-jobs { border-left: 4px solid #2196f3; }
    .pending { border-left: 4px solid #ff9800; }
    .completed { border-left: 4px solid #9c27b0; }

    .section-header {
      text-align: center;
      margin-bottom: 32px;
      padding: 20px;
    }

    .section-header h2 {
      margin: 0 0 8px 0;
      font-size: 22px;
      font-weight: 600;
      color: #333;
      letter-spacing: 0.5px;
    }

    .section-header p {
      margin: 0;
      font-size: 16px;
      color: #666;
      font-weight: 400;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
      background: #f8f9fa;
      border-radius: 12px;
      margin: 20px;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .empty-state h3 {
      font-size: 20px;
      font-weight: 600;
      margin: 16px 0 8px 0;
      color: #333;
    }

    .empty-state p {
      font-size: 16px;
      color: #666;
      margin: 0;
    }

    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
      gap: 24px;
      padding: 0 20px;
    }

    .booking-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .booking-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .booking-card.available { border-left: 4px solid #2196f3; }
    .booking-card.my-job { border-left: 4px solid #ff9800; }
    .booking-card.completed { border-left: 4px solid #4caf50; }

    .booking-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .booking-title span {
      font-weight: 600;
      font-size: 18px;
      color: #333;
      letter-spacing: 0.3px;
    }

    mat-card-header {
      padding-bottom: 16px;
    }

    mat-card-title {
      font-size: 18px !important;
      font-weight: 600 !important;
      color: #333 !important;
    }

    mat-card-subtitle {
      font-size: 14px !important;
      color: #666 !important;
      font-weight: 500 !important;
      margin-top: 4px !important;
    }

    .booking-details {
      padding: 8px 0;
    }

    .booking-details .detail-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 15px;
      line-height: 1.4;
    }

    .detail-row span {
      color: #333;
      font-weight: 400;
    }

    .detail-row strong {
      color: #555;
      font-weight: 600;
    }

    .detail-row mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
      flex-shrink: 0;
    }

    .detail-row.price-row {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
      background: #f8f9fa;
      margin-left: -16px;
      margin-right: -16px;
      padding-left: 16px;
      padding-right: 16px;
    }

    .price {
      font-size: 18px;
      font-weight: 700;
      color: #4caf50;
    }

    mat-card-actions {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #fafafa;
      margin: 16px -16px -16px -16px;
    }

    mat-card-actions button {
      flex: 1;
      font-weight: 500;
      font-size: 14px;
      padding: 12px 16px;
    }

    /* Tab styling improvements */
    .mat-mdc-tab-group {
      --mdc-tab-text-label-text-size: 16px;
      --mdc-tab-text-label-text-weight: 500;
    }

    .mat-mdc-tab {
      font-weight: 500 !important;
    }

    /* Chip styling */
    mat-chip {
      font-size: 12px !important;
      font-weight: 600 !important;
      letter-spacing: 0.3px !important;
    }

    /* General text improvements */
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Prevent any tooltip or overlay issues */
    .stat-card .mat-badge,
    .stat-card .mat-tooltip,
    .stat-card [matTooltip],
    .stat-card [title] {
      display: none !important;
    }

    /* Ensure no pseudo-elements interfere */
    .stat-card *::before,
    .stat-card *::after {
      content: none !important;
    }

    /* Fix any z-index issues */
    .stat-card {
      z-index: 1;
    }

    .stat-card .stat-content {
      z-index: 2;
      position: relative;
    }

    /* Prevent text selection issues */
    .stat-card {
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }
  `]
})
export class WasherDashboardComponent implements OnInit {
  availableBookings: Booking[] = [];
  myBookings: Booking[] = [];
  completedBookings: Booking[] = [];

  // Dashboard stats
  todayEarnings = 0;
  totalJobs = 0;
  pendingJobs = 0;
  completedJobs = 0;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadMockData();
    this.calculateStats();
  }

  loadMockData(): void {
    // Mock available bookings
    this.availableBookings = [
      {
        id: '1',
        bookingId: 'BK001',
        customerName: 'Rajesh Kumar',
        customerEmail: 'rajesh.kumar@gmail.com',
        customerPhone: '+91 9876543210',
        serviceName: 'Premium Car Wash',
        servicePrice: 799,
        carDetails: '2022 Honda City - White',
        scheduledDate: '2024-01-15',
        scheduledTime: '10:00 AM',
        estimatedDuration: '45 minutes',
        address: 'Bandra West, Mumbai, Maharashtra 400050',
        contactNumber: '+91 9876543210',
        specialInstructions: 'Please clean the interior thoroughly',
        status: 'PENDING'
      },
      {
        id: '2',
        bookingId: 'BK002',
        customerName: 'Priya Sharma',
        customerEmail: 'priya.sharma@gmail.com',
        customerPhone: '+91 9876543211',
        serviceName: 'Basic Car Wash',
        servicePrice: 399,
        carDetails: '2021 Maruti Swift - Red',
        scheduledDate: '2024-01-15',
        scheduledTime: '02:00 PM',
        estimatedDuration: '30 minutes',
        address: 'Andheri East, Mumbai, Maharashtra 400069',
        contactNumber: '+91 9876543211',
        status: 'PENDING'
      }
    ];
  }

  calculateStats(): void {
    this.totalJobs = this.myBookings.length + this.completedBookings.length;
    this.pendingJobs = this.myBookings.length;
    this.completedJobs = this.completedBookings.length;
    this.todayEarnings = this.completedBookings.reduce((sum, booking) => sum + booking.servicePrice, 0);
  }

  acceptBooking(booking: Booking): void {
    // Move booking from available to my jobs
    const index = this.availableBookings.findIndex(b => b.id === booking.id);
    if (index !== -1) {
      booking.status = 'ASSIGNED';
      booking.washerName = 'Test Washer';
      booking.washerPhone = '+91 9876543220';
      
      this.availableBookings.splice(index, 1);
      this.myBookings.push(booking);
      
      this.calculateStats();
      
      this.snackBar.open(
        `✅ Booking ${booking.bookingId} accepted! Customer has been notified.`,
        'Close',
        { duration: 5000 }
      );

      console.log('📧 Sending "Booking Assigned" email to customer:', booking.customerEmail);
      console.log('👨‍🔧 Washer assigned:', booking.washerName);
    }
  }

  completeJob(booking: Booking): void {
    // Move booking from my jobs to completed
    const index = this.myBookings.findIndex(b => b.id === booking.id);
    if (index !== -1) {
      booking.status = 'COMPLETED';
      
      this.myBookings.splice(index, 1);
      this.completedBookings.push(booking);
      
      this.calculateStats();
      
      this.snackBar.open(
        `🎉 Job completed! Customer has been notified and payment is processed.`,
        'Close',
        { duration: 5000 }
      );

      console.log('📧 Sending "Service Complete" email to customer:', booking.customerEmail);
      console.log('✅ Job completed by washer:', booking.washerName);
    }
  }
}
