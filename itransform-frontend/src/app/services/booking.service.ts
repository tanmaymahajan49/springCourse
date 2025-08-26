import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, switchMap, catchError } from 'rxjs/operators';
import { PaymentService, PaymentRequest, SpringPaymentRequest } from './payment.service';

export interface Booking {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  washerId?: string;
  washerName?: string;
  washerPhone?: string;
  serviceName: string;
  servicePrice: number;
  carDetails: string;
  carMake: string;
  carModel: string;
  carColor: string;
  licensePlate: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: string;
  address: string;
  contactNumber: string;
  specialInstructions?: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WasherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  isAvailable: boolean;
  averageRating: number;
  totalJobs: number;
  totalEarnings: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}

export interface BookingRequest {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId: string;
  carDetails: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  serviceType: string;
  servicePackage: string;
  scheduledDate: Date;
  scheduledTime: string;
  address: string;
  amount: number;
  washerId?: string;
  washerName?: string;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  paymentId?: string;
  message: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8083/api/bookings'; // Spring Boot Booking Service
  
  // Mock data for development
  private mockBookings: Booking[] = [
    {
      id: '1',
      bookingId: 'BK001',
      customerId: 'cust_001',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh.kumar@gmail.com',
      customerPhone: '+91 9876543210',
      serviceName: 'Premium Car Wash',
      servicePrice: 799,
      carDetails: '2022 Honda City - White',
      carMake: 'Honda',
      carModel: 'City',
      carColor: 'White',
      licensePlate: 'MH01AB1234',
      scheduledDate: '2024-01-15',
      scheduledTime: '10:00 AM',
      estimatedDuration: '45 minutes',
      address: 'Bandra West, Mumbai, Maharashtra 400050',
      contactNumber: '+91 9876543210',
      specialInstructions: 'Please clean the interior thoroughly',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount: 799,
      createdAt: new Date('2024-01-14T09:00:00'),
      updatedAt: new Date('2024-01-14T09:00:00')
    },
    {
      id: '2',
      bookingId: 'BK002',
      customerId: 'cust_002',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@gmail.com',
      customerPhone: '+91 9876543211',
      serviceName: 'Basic Car Wash',
      servicePrice: 399,
      carDetails: '2021 Maruti Swift - Red',
      carMake: 'Maruti',
      carModel: 'Swift',
      carColor: 'Red',
      licensePlate: 'MH02CD5678',
      scheduledDate: '2024-01-15',
      scheduledTime: '02:00 PM',
      estimatedDuration: '30 minutes',
      address: 'Andheri East, Mumbai, Maharashtra 400069',
      contactNumber: '+91 9876543211',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount: 399,
      createdAt: new Date('2024-01-14T10:30:00'),
      updatedAt: new Date('2024-01-14T10:30:00')
    },
    {
      id: '3',
      bookingId: 'BK003',
      customerId: 'cust_003',
      customerName: 'Amit Patel',
      customerEmail: 'amit.patel@gmail.com',
      customerPhone: '+91 9876543212',
      washerId: 'washer_001',
      washerName: 'Suresh Kumar',
      washerPhone: '+91 9876543220',
      serviceName: 'Deluxe Car Wash',
      servicePrice: 1299,
      carDetails: '2023 Toyota Innova - Silver',
      carMake: 'Toyota',
      carModel: 'Innova',
      carColor: 'Silver',
      licensePlate: 'MH03EF9012',
      scheduledDate: '2024-01-15',
      scheduledTime: '11:00 AM',
      estimatedDuration: '60 minutes',
      address: 'Powai, Mumbai, Maharashtra 400076',
      contactNumber: '+91 9876543212',
      specialInstructions: 'Car is very dirty, needs extra attention',
      status: 'IN_PROGRESS',
      paymentStatus: 'PENDING',
      totalAmount: 1299,
      createdAt: new Date('2024-01-14T08:15:00'),
      updatedAt: new Date('2024-01-15T11:00:00')
    },
    {
      id: '4',
      bookingId: 'BK004',
      customerId: 'cust_004',
      customerName: 'Sneha Reddy',
      customerEmail: 'sneha.reddy@gmail.com',
      customerPhone: '+91 9876543213',
      washerId: 'washer_001',
      washerName: 'Suresh Kumar',
      washerPhone: '+91 9876543220',
      serviceName: 'Premium Car Wash',
      servicePrice: 799,
      carDetails: '2020 Hyundai Creta - Blue',
      carMake: 'Hyundai',
      carModel: 'Creta',
      carColor: 'Blue',
      licensePlate: 'MH04GH3456',
      scheduledDate: '2024-01-14',
      scheduledTime: '03:00 PM',
      estimatedDuration: '45 minutes',
      address: 'Thane West, Mumbai, Maharashtra 400601',
      contactNumber: '+91 9876543213',
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      totalAmount: 799,
      createdAt: new Date('2024-01-13T14:00:00'),
      updatedAt: new Date('2024-01-14T16:00:00')
    }
  ];

  private bookingsSubject = new BehaviorSubject<Booking[]>(this.mockBookings);
  public bookings$ = this.bookingsSubject.asObservable();

  constructor(private http: HttpClient, private paymentService: PaymentService) {}

  /**
   * Get all bookings
   */
  getAllBookings(): Observable<Booking[]> {
    return this.bookings$;
  }

  /**
   * Get available bookings from Spring Boot Washer Service with localStorage fallback
   */
  getAvailableBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`http://localhost:8082/api/washers/available-bookings`).pipe(
      catchError(error => {
        console.error('Error fetching available bookings from Spring Boot:', error);
        console.log('🔄 Using fallback: localStorage + mock data');

        // Get bookings from localStorage (created by booking component)
        const localBookings = JSON.parse(localStorage.getItem('carWashBookings') || '[]');
        const pendingLocalBookings = localBookings.filter((booking: any) =>
          booking.bookingStatus === 'PENDING' && !booking.washerId
        );

        // Combine with mock data
        const availableBookings = [
          ...pendingLocalBookings,
          ...this.mockBookings.filter(booking =>
            booking.status === 'PENDING' && !booking.washerId
          )
        ];

        console.log('📋 Available bookings from fallback:', availableBookings);
        return of(availableBookings);
      })
    );
  }

  /**
   * Get bookings assigned to a specific washer
   */
  getWasherBookings(washerId: string): Observable<Booking[]> {
    return new Observable(observer => {
      const washerBookings = this.mockBookings.filter(booking => 
        booking.washerId === washerId
      );
      observer.next(washerBookings);
      observer.complete();
    });
  }

  /**
   * Assign booking to washer
   */
  assignBookingToWasher(bookingId: string, washerId: string, washerName: string, washerPhone: string): Promise<Booking> {
    return new Promise((resolve, reject) => {
      const bookingIndex = this.mockBookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex !== -1) {
        this.mockBookings[bookingIndex] = {
          ...this.mockBookings[bookingIndex],
          washerId: washerId,
          washerName: washerName,
          washerPhone: washerPhone,
          status: 'ASSIGNED',
          updatedAt: new Date()
        };
        
        this.bookingsSubject.next([...this.mockBookings]);
        resolve(this.mockBookings[bookingIndex]);
      } else {
        reject(new Error('Booking not found'));
      }
    });
  }

  /**
   * Update booking status
   */
  updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    return new Promise((resolve, reject) => {
      const bookingIndex = this.mockBookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex !== -1) {
        this.mockBookings[bookingIndex] = {
          ...this.mockBookings[bookingIndex],
          status: status,
          updatedAt: new Date()
        };
        
        this.bookingsSubject.next([...this.mockBookings]);
        resolve(this.mockBookings[bookingIndex]);
      } else {
        reject(new Error('Booking not found'));
      }
    });
  }

  /**
   * Get booking by ID
   */
  getBookingById(bookingId: string): Observable<Booking | undefined> {
    return new Observable(observer => {
      const booking = this.mockBookings.find(b => b.id === bookingId);
      observer.next(booking);
      observer.complete();
    });
  }

  // Payment Integration Methods

  /**
   * Get available service packages
   */
  getServicePackages(): Observable<ServicePackage[]> {
    const packages: ServicePackage[] = [
      {
        id: 'basic',
        name: 'Basic Wash',
        description: 'Essential exterior cleaning',
        price: 299,
        duration: '30 mins',
        features: [
          'Exterior wash',
          'Wheel cleaning',
          'Basic drying',
          'Tire shine'
        ]
      },
      {
        id: 'premium',
        name: 'Premium Wash',
        description: 'Complete interior and exterior cleaning',
        price: 599,
        duration: '60 mins',
        features: [
          'Exterior wash',
          'Interior vacuuming',
          'Dashboard cleaning',
          'Seat cleaning',
          'Window cleaning',
          'Tire shine',
          'Air freshener'
        ]
      },
      {
        id: 'deluxe',
        name: 'Deluxe Wash',
        description: 'Premium service with wax and polish',
        price: 899,
        duration: '90 mins',
        features: [
          'Complete premium wash',
          'Car wax application',
          'Polish and shine',
          'Engine bay cleaning',
          'Leather conditioning',
          'Premium air freshener',
          'Water spot removal'
        ]
      },
      {
        id: 'express',
        name: 'Express Wash',
        description: 'Quick exterior wash',
        price: 199,
        duration: '15 mins',
        features: [
          'Quick exterior wash',
          'Basic drying',
          'Wheel rinse'
        ]
      }
    ];

    return of(packages).pipe(delay(300));
  }

  /**
   * Get available time slots for a date
   */
  getAvailableTimeSlots(date: Date): Observable<string[]> {
    const timeSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
      '06:00 PM', '06:30 PM', '07:00 PM'
    ];

    // Simulate some slots being unavailable
    const availableSlots = timeSlots.filter(() => Math.random() > 0.3);

    return of(availableSlots).pipe(delay(500));
  }

  /**
   * Create booking with payment integration
   */
  createBookingWithPayment(bookingRequest: BookingRequest): Observable<BookingResponse> {
    return this.paymentService.createOrder(bookingRequest.amount).pipe(
      switchMap(orderId => {
        const paymentRequest: PaymentRequest = {
          amount: bookingRequest.amount,
          currency: 'INR',
          orderId: orderId,
          customerName: bookingRequest.customerName,
          customerEmail: bookingRequest.customerEmail,
          customerPhone: bookingRequest.customerPhone,
          description: `${bookingRequest.servicePackage} - ${bookingRequest.carDetails.make} ${bookingRequest.carDetails.model}`
        };

        return this.paymentService.initiatePayment(paymentRequest).pipe(
          switchMap(paymentResponse => {
            if (paymentResponse.success) {
              // Process payment in Spring backend after Razorpay success
              const springPaymentData: SpringPaymentRequest = {
                washerId: 1, // Default washer ID, you can make this dynamic
                customerId: parseInt(bookingRequest.customerId) || 1,
                amount: bookingRequest.amount,
                status: 'COMPLETE'
              };

              return this.paymentService.processPaymentInBackend(springPaymentData).pipe(
                switchMap(backendResponse => {
                  console.log('✅ Payment processed in Spring backend:', backendResponse);
                  // Create booking after successful payment processing
                  return this.createNewBooking(bookingRequest, paymentResponse.paymentId!);
                }),
                catchError(backendError => {
                  console.error('❌ Backend payment processing failed:', backendError);
                  // Still create booking even if backend processing fails
                  return this.createNewBooking(bookingRequest, paymentResponse.paymentId!);
                })
              );
            } else {
              return of({
                success: false,
                message: 'Payment failed',
                error: paymentResponse.error
              });
            }
          })
        );
      })
    );
  }

  /**
   * Create new booking after payment
   */
  private createNewBooking(bookingRequest: BookingRequest, paymentId: string): Observable<BookingResponse> {
    const bookingId = 'book_' + Math.random().toString(36).substr(2, 12);

    const newBooking: Booking = {
      id: bookingId,
      bookingId: bookingId.toUpperCase(),
      customerId: bookingRequest.customerId,
      customerName: bookingRequest.customerName,
      customerEmail: bookingRequest.customerEmail,
      customerPhone: bookingRequest.customerPhone,
      serviceName: bookingRequest.serviceType,
      servicePrice: bookingRequest.amount,
      carDetails: `${bookingRequest.carDetails.year} ${bookingRequest.carDetails.make} ${bookingRequest.carDetails.model} - ${bookingRequest.carDetails.color}`,
      carMake: bookingRequest.carDetails.make,
      carModel: bookingRequest.carDetails.model,
      carColor: bookingRequest.carDetails.color,
      licensePlate: bookingRequest.carDetails.licensePlate,
      scheduledDate: bookingRequest.scheduledDate.toISOString().split('T')[0],
      scheduledTime: bookingRequest.scheduledTime,
      estimatedDuration: '45 minutes',
      address: bookingRequest.address,
      contactNumber: bookingRequest.customerPhone,
      status: 'PENDING',
      paymentStatus: 'PAID',
      totalAmount: bookingRequest.amount,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock bookings
    this.mockBookings.push(newBooking);
    this.bookingsSubject.next([...this.mockBookings]);

    return of({
      success: true,
      bookingId: bookingId,
      paymentId: paymentId,
      message: 'Booking created successfully! You will receive a confirmation email shortly.'
    }).pipe(delay(1000));
  }

  /**
   * Get customer bookings
   */
  getCustomerBookings(customerId: string): Observable<Booking[]> {
    return new Observable(observer => {
      const customerBookings = this.mockBookings.filter(booking =>
        booking.customerId === customerId
      );
      observer.next(customerBookings);
      observer.complete();
    });
  }
}
