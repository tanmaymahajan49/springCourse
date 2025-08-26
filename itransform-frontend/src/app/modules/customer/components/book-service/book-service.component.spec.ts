import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { BookServiceComponent } from './book-service.component';
import { EmailService } from '../../../../services/email.service';
import { NotificationService } from '../../../../services/notification.service';
import { AuthService } from '../../../../services/auth.service';
import { BookingService } from '../../../../services/booking.service';
import { PaymentService } from '../../../../services/payment.service';

describe('BookServiceComponent', () => {
  let component: BookServiceComponent;
  let fixture: ComponentFixture<BookServiceComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockEmailService: jasmine.SpyObj<EmailService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockBookingService: jasmine.SpyObj<BookingService>;
  let mockPaymentService: jasmine.SpyObj<PaymentService>;

  beforeEach(async () => {
    // Create spy objects for all dependencies
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockEmailService = jasmine.createSpyObj('EmailService', ['requestNotificationPermission', 'sendRealEmail']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['showInfo', 'showSuccess', 'showError']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'mockAutoLogin']);
    mockBookingService = jasmine.createSpyObj('BookingService', ['createBookingWithPayment']);
    mockPaymentService = jasmine.createSpyObj('PaymentService', ['createOrder', 'initiatePayment']);

    // Configure TestBed with all required modules and providers
    await TestBed.configureTestingModule({
      imports: [
        BookServiceComponent, // Standalone component
        ReactiveFormsModule,
        NoopAnimationsModule, // Disable animations for testing
        MatCardModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: EmailService, useValue: mockEmailService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: BookingService, useValue: mockBookingService },
        { provide: PaymentService, useValue: mockPaymentService }
      ]
    }).compileComponents();

    // Create component fixture
    fixture = TestBed.createComponent(BookServiceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    // Mock user data
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210',
      registeredCars: [
        {
          id: 'car1',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          color: 'White',
          licensePlate: 'MH01AB1234'
        }
      ]
    };
    
    mockAuthService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(component.serviceForm).toBeDefined();
    expect(component.carForm).toBeDefined();
    expect(component.scheduleForm).toBeDefined();
    expect(mockEmailService.requestNotificationPermission).toHaveBeenCalled();
  });

  it('should select package correctly', () => {
    const testPackage = component.servicePackages[0]; // Basic Wash
    
    component.selectPackage(testPackage);
    
    expect(component.selectedPackage).toBe(testPackage);
    expect(component.serviceForm.get('packageId')?.value).toBe(testPackage.id);
  });

  it('should select car correctly', () => {
    const testCar = {
      id: 'car1',
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      color: 'Blue',
      licensePlate: 'MH02CD5678'
    };
    
    component.selectCar(testCar);
    
    expect(component.selectedCar).toBe(testCar);
    expect(component.carForm.get('carId')?.value).toBe(testCar.id);
  });

  it('should calculate total price correctly', () => {
    const premiumPackage = component.servicePackages.find(p => p.id === 'premium');
    component.selectedPackage = premiumPackage!;
    
    const totalPrice = component.getTotalPrice();
    
    expect(totalPrice).toBe(599);
  });

  it('should handle form submission with valid data', async () => {
    // Setup component with valid data
    component.ngOnInit();
    
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210'
    };
    
    const mockBookingResponse = {
      success: true,
      bookingId: 'BK123',
      paymentId: 'pay_test123',
      message: 'Booking created successfully'
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockBookingService.createBookingWithPayment.and.returnValue(of(mockBookingResponse));
    mockEmailService.sendRealEmail.and.returnValue(Promise.resolve());

    // Set up forms with valid data
    component.selectedPackage = component.servicePackages[0];
    component.selectedCar = {
      id: 'car1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'White',
      licensePlate: 'MH01AB1234'
    };

    component.serviceForm.patchValue({ packageId: 'basic' });
    component.carForm.patchValue({ carId: 'car1' });
    component.scheduleForm.patchValue({
      date: new Date(),
      timeSlot: '10:00 AM',
      address: '123 Test Street',
      contactNumber: '+91 9876543210'
    });

    await component.onSubmit();

    expect(mockNotificationService.showInfo).toHaveBeenCalledWith('Processing payment...', 'Please wait');
    expect(mockBookingService.createBookingWithPayment).toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
  });

  it('should handle form submission with invalid data', async () => {
    component.ngOnInit();
    
    // Leave forms empty (invalid)
    await component.onSubmit();
    
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'OK'
    );
  });

  it('should handle booking failure', async () => {
    component.ngOnInit();
    
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210'
    };

    const mockFailureResponse = {
      success: false,
      message: 'Payment failed',
      error: 'Insufficient funds'
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockBookingService.createBookingWithPayment.and.returnValue(of(mockFailureResponse));

    // Set up forms with valid data
    component.selectedPackage = component.servicePackages[0];
    component.selectedCar = {
      id: 'car1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'White',
      licensePlate: 'MH01AB1234'
    };

    component.serviceForm.patchValue({ packageId: 'basic' });
    component.carForm.patchValue({ carId: 'car1' });
    component.scheduleForm.patchValue({
      date: new Date(),
      timeSlot: '10:00 AM',
      address: '123 Test Street',
      contactNumber: '+91 9876543210'
    });

    await component.onSubmit();

    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Payment failed',
      'OK'
    );
  });

  it('should select available time slot', () => {
    const availableSlot = { time: '10:00 AM', available: true };
    const unavailableSlot = { time: '11:00 AM', available: false };
    
    component.ngOnInit();
    
    // Test selecting available slot
    component.selectTimeSlot(availableSlot);
    expect(component.scheduleForm.get('timeSlot')?.value).toBe('10:00 AM');
    
    // Test selecting unavailable slot (should not update form)
    component.selectTimeSlot(unavailableSlot);
    expect(component.scheduleForm.get('timeSlot')?.value).toBe('10:00 AM'); // Should remain unchanged
  });

  it('should load user cars on initialization', () => {
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210',
      registeredCars: [
        {
          id: 'car1',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          color: 'White',
          licensePlate: 'MH01AB1234'
        },
        {
          id: 'car2',
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          color: 'Blue',
          licensePlate: 'MH02CD5678'
        }
      ]
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(component.cars.length).toBe(2);
    expect(component.cars[0].make).toBe('Toyota');
    expect(component.cars[1].make).toBe('Honda');
  });

  // EDGE & NEGATIVE TESTS
  it('should not select a package with an invalid ID', () => {
    const invalidPackage = { id: 'invalid', name: 'Invalid', description: '', price: 0, duration: '', features: [] };
    component.selectPackage(invalidPackage as any);
    expect(component.selectedPackage).toBe(invalidPackage);
    expect(component.serviceForm.get('packageId')?.value).toBe('invalid');
    // But getTotalPrice should be 0 (not a real package)
    expect(component.getTotalPrice()).toBe(0);
  });

  it('should not select a car with an invalid ID', () => {
    const invalidCar = { id: 'invalid', make: '', model: '', year: 2000, color: '', licensePlate: '' };
    component.selectCar(invalidCar as any);
    expect(component.selectedCar).toBe(invalidCar);
    expect(component.carForm.get('carId')?.value).toBe('invalid');
  });

  it('should not allow scheduling with a past date (edge case)', async () => {
    component.ngOnInit();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    component.scheduleForm.patchValue({ date: yesterday, timeSlot: '09:00 AM', address: 'Test', contactNumber: '+919876543210' });
    component.serviceForm.patchValue({ packageId: 'basic' });
    component.carForm.patchValue({ carId: 'car1' });
    await component.onSubmit();
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'OK'
    );
  });

  it('should not allow contact number shorter than 10 digits (edge case)', async () => {
    component.ngOnInit();
    component.scheduleForm.patchValue({ date: new Date(), timeSlot: '09:00 AM', address: 'Test', contactNumber: '12345' });
    component.serviceForm.patchValue({ packageId: 'basic' });
    component.carForm.patchValue({ carId: 'car1' });
    await component.onSubmit();
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'OK'
    );
  });

  it('should not allow empty address (edge case)', async () => {
    component.ngOnInit();
    component.scheduleForm.patchValue({ date: new Date(), timeSlot: '09:00 AM', address: '', contactNumber: '+919876543210' });
    component.serviceForm.patchValue({ packageId: 'basic' });
    component.carForm.patchValue({ carId: 'car1' });
    await component.onSubmit();
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'OK'
    );
  });

  it('should handle booking creation failure (negative test)', async () => {
    component.ngOnInit();
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210'
    };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockBookingService.createBookingWithPayment.and.returnValue(of({ success: false, message: 'Server error' }));
    component.selectedPackage = component.servicePackages[0];
    component.selectedCar = {
      id: 'car1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'White',
      licensePlate: 'MH01AB1234'
    };
    component.serviceForm.patchValue({ packageId: 'basic' });
    component.carForm.patchValue({ carId: 'car1' });
    component.scheduleForm.patchValue({
      date: new Date(),
      timeSlot: '10:00 AM',
      address: '123 Test Street',
      contactNumber: '+91 9876543210'
    });
    await component.onSubmit();
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Server error',
      'OK'
    );
  });
});
