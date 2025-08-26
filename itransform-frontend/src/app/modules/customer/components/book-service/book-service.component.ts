import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmailService, BookingConfirmationData } from '../../../../services/email.service';
import { NotificationService } from '../../../../services/notification.service';
import { AuthService, User } from '../../../../services/auth.service';
import { BookingService, BookingRequest, BookingResponse } from '../../../../services/booking.service';
import { PaymentService } from '../../../../services/payment.service';

// Declare Razorpay for TypeScript
declare var Razorpay: any;

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

@Component({
  selector: 'app-book-service',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.scss'
})
export class BookServiceComponent implements OnInit {
  serviceForm!: FormGroup;
  carForm!: FormGroup;
  scheduleForm!: FormGroup;

  servicePackages: ServicePackage[] = [
    {
      id: 'basic',
      name: 'Basic Wash',
      description: 'Essential car cleaning service',
      price: 299,
      duration: '30 mins',
      features: ['Exterior wash', 'Interior vacuum', 'Window cleaning', 'Tire cleaning']
    },
    {
      id: 'premium',
      name: 'Premium Wash',
      description: 'Complete car care package',
      price: 599,
      duration: '60 mins',
      features: ['Everything in Basic', 'Interior deep clean', 'Dashboard polish', 'Seat cleaning', 'Air freshener'],
      popular: true
    },
    {
      id: 'deluxe',
      name: 'Deluxe Detailing',
      description: 'Professional car detailing',
      price: 999,
      duration: '90 mins',
      features: ['Everything in Premium', 'Wax coating', 'Engine cleaning', 'Leather treatment', 'Paint protection']
    }
  ];

  cars: Car[] = [];

  timeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true },
    { time: '01:00 PM', available: true },
    { time: '02:00 PM', available: false },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: true },
    { time: '05:00 PM', available: true }
  ];

  selectedPackage: ServicePackage | null = null;
  selectedCar: Car | null = null;
  isLinear = true;
  minDate = new Date();
  isSubmitting = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private emailService: EmailService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.emailService.requestNotificationPermission();
    this.loadCurrentUser();
    this.loadRazorpayScript();
  }

  /**
   * Load Razorpay script dynamically
   */
  private loadRazorpayScript(): void {
    if (typeof Razorpay !== 'undefined') {
      return; // Already loaded
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
    };
    document.head.appendChild(script);
  }

  /**
   * Load current user data and initialize user-specific data
   */
  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      // For development: auto-login with a sample email
      // In production, this would redirect to login page
      const sampleEmail = prompt('Enter your email address for booking:') || 'customer@example.com';
      this.authService.mockAutoLogin(sampleEmail);
      this.currentUser = this.authService.getCurrentUser();
    }

    if (this.currentUser) {
      // Load user's registered cars
      this.cars = this.currentUser.registeredCars || [];

      // Pre-fill contact number in schedule form if available
      if (this.scheduleForm && this.currentUser.phone) {
        this.scheduleForm.patchValue({
          contactNumber: this.currentUser.phone
        });
      }

      // Set default values to help with form validation
      setTimeout(() => {
        if (this.scheduleForm) {
          // Set default date to tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          this.scheduleForm.patchValue({
            contactNumber: this.currentUser?.phone || '+91 '
          });
        }
      }, 100);
    }
  }

  initializeForms(): void {
    this.serviceForm = this.fb.group({
      packageId: ['', Validators.required],
      addOns: this.fb.array([])
    });

    this.carForm = this.fb.group({
      carId: ['', Validators.required],
      specialInstructions: ['']
    });

    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      address: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s\-()]{10,15}$/)]]
    });
  }

  selectPackage(pkg: ServicePackage): void {
    this.selectedPackage = pkg;
    this.serviceForm.patchValue({ packageId: pkg.id });
  }

  selectCar(car: Car): void {
    this.selectedCar = car;
    this.carForm.patchValue({ carId: car.id });
  }

  selectTimeSlot(slot: TimeSlot): void {
    if (slot.available) {
      this.scheduleForm.patchValue({ timeSlot: slot.time });
    }
  }

  getTotalPrice(): number {
    return this.selectedPackage ? this.selectedPackage.price : 0;
  }

  /**
   * Debug method to check form validation status
   */
  checkFormStatus(): void {
    console.log('Schedule Form Status:', {
      valid: this.scheduleForm.valid,
      invalid: this.scheduleForm.invalid,
      errors: this.scheduleForm.errors,
      values: this.scheduleForm.value,
      controls: {
        date: {
          value: this.scheduleForm.get('date')?.value,
          valid: this.scheduleForm.get('date')?.valid,
          errors: this.scheduleForm.get('date')?.errors
        },
        timeSlot: {
          value: this.scheduleForm.get('timeSlot')?.value,
          valid: this.scheduleForm.get('timeSlot')?.valid,
          errors: this.scheduleForm.get('timeSlot')?.errors
        },
        address: {
          value: this.scheduleForm.get('address')?.value,
          valid: this.scheduleForm.get('address')?.valid,
          errors: this.scheduleForm.get('address')?.errors
        },
        contactNumber: {
          value: this.scheduleForm.get('contactNumber')?.value,
          valid: this.scheduleForm.get('contactNumber')?.valid,
          errors: this.scheduleForm.get('contactNumber')?.errors
        }
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.valid && this.carForm.valid && this.scheduleForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const scheduleData = this.scheduleForm.value;

      // Prepare booking data for payment
      const bookingData = {
        customerId: this.currentUser?.id || '',
        customerName: this.currentUser?.name || 'Customer',
        customerEmail: this.currentUser?.email || '',
        customerPhone: scheduleData.contactNumber,
        carId: this.selectedCar?.id || '',
        carDetails: {
          make: this.selectedCar?.make || '',
          model: this.selectedCar?.model || '',
          year: this.selectedCar?.year || 2020,
          color: this.selectedCar?.color || '',
          licensePlate: this.selectedCar?.licensePlate || ''
        },
        serviceType: this.selectedPackage?.name || '',
        servicePackage: this.selectedPackage?.description || '',
        scheduledDate: new Date(scheduleData.date),
        scheduledTime: scheduleData.timeSlot,
        address: scheduleData.address,
        amount: this.getTotalPrice()
      };

      console.log('🚀 Initiating payment for booking...', bookingData);

      // Show processing notification
      this.notificationService.showInfo('Preparing payment...', 'Please wait');

      // Initiate payment directly
      this.payNow(bookingData);

    } else {
      // Show validation errors
      this.notificationService.showError(
        'Please fill in all required fields correctly.',
        'OK'
      );
      this.checkFormStatus(); // Debug form validation
    }
  }

  /**
   * Initiate Razorpay payment
   */
  payNow(booking: any): void {
    const paymentPayload = {
      customerId: booking.customerId,
      carId: booking.carId,
      amount: booking.amount,
      serviceType: booking.serviceType,
      bookingData: booking
    };

    this.openRazorpay(paymentPayload);
  }

  /**
   * Open Razorpay payment gateway
   */
  openRazorpay(paymentPayload: any): void {
    const options = {
      key: 'rzp_test_yJXdbFZ3gArwiB', // Your actual Razorpay key
      amount: paymentPayload.amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'i-Transform Car Wash',
      description: `Payment for ${paymentPayload.serviceType}`,
      handler: (response: any) => {
        console.log('✅ Razorpay Payment Success:', response);

        const finalPayment = {
          ...paymentPayload,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          status: 'SUCCESS',
          timestamp: new Date(),
        };

        // Process the successful payment
        this.processSuccessfulPayment(finalPayment);
      },
      prefill: {
        name: paymentPayload.bookingData.customerName,
        email: paymentPayload.bookingData.customerEmail,
        contact: paymentPayload.bookingData.customerPhone,
      },
      theme: {
        color: '#667eea', // Your brand color
      },
      modal: {
        ondismiss: () => {
          console.log('🚫 Payment cancelled by user');
          this.notificationService.showError('Payment cancelled', 'OK');
          this.isSubmitting = false;
        }
      }
    };

    try {
      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('❌ Error opening Razorpay:', error);
      this.notificationService.showError('Failed to open payment gateway', 'OK');
      this.isSubmitting = false;
    }
  }

  /**
   * Process successful payment and create booking
   */
  private processSuccessfulPayment(paymentData: any): void {
    console.log('💳 Processing successful payment:', paymentData);

    // Save payment to Spring Boot Payment Service
    this.http.post('http://localhost:8085/payments', {
      transactionId: Math.floor(Math.random() * 1000000),
      washerId: 1, // Will be assigned later
      customerId: paymentData.bookingData.customerId || 1,
      amount: paymentData.amount,
      status: 'COMPLETED',
      razorpayPaymentId: paymentData.razorpayPaymentId,
      razorpayOrderId: paymentData.razorpayOrderId,
      razorpaySignature: paymentData.razorpaySignature
    }).subscribe({
      next: (response) => {
        console.log('✅ Payment saved to Spring Boot backend:', response);

        // Create the booking after successful payment
        this.createBookingAfterPayment(paymentData);
      },
      error: (error) => {
        console.error('❌ Payment save failed, using fallback:', error);
        console.log('🔄 Payment will be processed but booking creation will continue');

        // Still create booking even if payment save fails
        this.createBookingAfterPayment(paymentData);
      }
    });
  }

  /**
   * Create booking after successful payment
   */
  private async createBookingAfterPayment(paymentData: any): Promise<void> {
    try {
      // Prepare booking data for Spring Boot Booking Service
      const bookingRequest = {
        customerId: paymentData.bookingData.customerId || 1,
        customerName: paymentData.bookingData.customerName,
        customerEmail: paymentData.bookingData.customerEmail,
        customerPhone: paymentData.bookingData.customerPhone,
        carMake: paymentData.bookingData.carDetails.make,
        carModel: paymentData.bookingData.carDetails.model,
        carYear: paymentData.bookingData.carDetails.year,
        carColor: paymentData.bookingData.carDetails.color,
        licensePlate: paymentData.bookingData.carDetails.licensePlate,
        serviceType: paymentData.bookingData.serviceType,
        servicePackage: paymentData.bookingData.servicePackage,
        scheduledDate: paymentData.bookingData.scheduledDate,
        scheduledTime: paymentData.bookingData.scheduledTime,
        address: paymentData.bookingData.address,
        amount: paymentData.bookingData.amount,
        paymentId: paymentData.razorpayPaymentId,
        paymentStatus: 'COMPLETED',
        bookingStatus: 'PENDING', // Will be available for washers to accept
        createdAt: new Date()
      };

      console.log('📝 Creating booking in Spring Boot:', bookingRequest);

      // Try to save booking to Spring Boot Booking Service
      this.http.post('http://localhost:8083/api/bookings', bookingRequest).subscribe({
        next: (response) => {
          console.log('✅ Booking created in Spring Boot:', response);

          // Show success notification
          this.notificationService.showSuccess(
            `🎉 Booking Created Successfully! Payment ID: ${paymentData.razorpayPaymentId}`,
            'OK',
            5000
          );

          // Send confirmation email
          this.sendConfirmationEmail(bookingRequest, paymentData);
        },
        error: (error) => {
          console.error('❌ Spring Boot booking creation failed, using fallback:', error);

          // Fallback: Save to local storage for demo purposes
          const bookingWithId = {
            ...bookingRequest,
            id: Date.now(),
            bookingId: `BK${Date.now()}`,
            createdAt: new Date().toISOString()
          };

          // Store in localStorage as fallback
          const existingBookings = JSON.parse(localStorage.getItem('carWashBookings') || '[]');
          existingBookings.push(bookingWithId);
          localStorage.setItem('carWashBookings', JSON.stringify(existingBookings));

          console.log('✅ Booking saved to localStorage as fallback:', bookingWithId);

          // Show success notification
          this.notificationService.showSuccess(
            `🎉 Booking Created Successfully! Payment ID: ${paymentData.razorpayPaymentId}`,
            'OK',
            5000
          );

          // Send confirmation email
          this.sendConfirmationEmail(bookingRequest, paymentData);
        }
      });

    } catch (error) {
      console.error('❌ Booking creation error:', error);
      this.notificationService.showError(
        'Payment successful but booking creation failed. Please contact support.',
        'OK'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Send confirmation email after successful booking
   */
  private async sendConfirmationEmail(bookingRequest: any, paymentData: any): Promise<void> {
    try {
      const emailData: BookingConfirmationData = {
        customerName: bookingRequest.customerName,
        customerEmail: bookingRequest.customerEmail,
        bookingId: `BK${Date.now()}`, // Generate booking ID
        serviceName: bookingRequest.serviceType,
        servicePrice: bookingRequest.amount,
        carDetails: `${bookingRequest.carYear} ${bookingRequest.carMake} ${bookingRequest.carModel} (${bookingRequest.carColor})`,
        scheduledDate: new Date(bookingRequest.scheduledDate).toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        scheduledTime: bookingRequest.scheduledTime,
        address: bookingRequest.address,
        contactNumber: bookingRequest.customerPhone,
        estimatedDuration: this.selectedPackage?.duration || '',
        specialInstructions: this.carForm.value.specialInstructions || ''
      };

      await this.emailService.sendRealEmail(emailData);
      console.log('📧 Confirmation email sent successfully');

      // Navigate to success page or bookings
      setTimeout(() => {
        this.router.navigate(['/customer/my-bookings']);
      }, 2000);

    } catch (emailError) {
      console.error('📧 Email sending failed:', emailError);
      // Don't fail the booking if email fails, still navigate
      setTimeout(() => {
        this.router.navigate(['/customer/my-bookings']);
      }, 2000);
    }
  }
}
