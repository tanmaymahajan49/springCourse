import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredCars: Car[];
  totalBookings: number;
  totalSpent: number;
  joinedDate: Date;
  status: 'active' | 'inactive';
}

export interface Washer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceAreas: string[];
  rating: number;
  totalJobs: number;
  totalEarnings: number;
  joinedDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  availability: 'available' | 'busy' | 'offline';
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  washerId: string;
  washerName: string;
  carDetails: Car;
  serviceType: string;
  servicePackage: string;
  scheduledDate: Date;
  scheduledTime: string;
  address: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdDate: Date;
  completedDate?: Date;
  rating?: number;
  feedback?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  // Mock data for customers
  private mockCustomers: Customer[] = [
    {
      id: 'cust_001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      phone: '+91 9876543210',
      address: 'Bandra West, Mumbai, Maharashtra 400050',
      registeredCars: [
        { id: 'car_001', make: 'Honda', model: 'City', year: 2022, color: 'White', licensePlate: 'MH01AB1234' },
        { id: 'car_002', make: 'Maruti', model: 'Swift', year: 2021, color: 'Red', licensePlate: 'MH02CD5678' }
      ],
      totalBookings: 15,
      totalSpent: 4500,
      joinedDate: new Date('2024-01-15'),
      status: 'active'
    },
    {
      id: 'cust_002',
      name: 'Priya Sharma',
      email: 'priya.sharma@yahoo.com',
      phone: '+91 9876543211',
      address: 'Koregaon Park, Pune, Maharashtra 411001',
      registeredCars: [
        { id: 'car_003', make: 'Hyundai', model: 'i20', year: 2023, color: 'Blue', licensePlate: 'MH12EF9012' }
      ],
      totalBookings: 8,
      totalSpent: 2400,
      joinedDate: new Date('2024-02-20'),
      status: 'active'
    },
    {
      id: 'cust_003',
      name: 'Amit Patel',
      email: 'amit.patel@hotmail.com',
      phone: '+91 9876543212',
      address: 'Satellite, Ahmedabad, Gujarat 380015',
      registeredCars: [
        { id: 'car_004', make: 'Toyota', model: 'Innova', year: 2020, color: 'Silver', licensePlate: 'GJ01GH3456' }
      ],
      totalBookings: 12,
      totalSpent: 3600,
      joinedDate: new Date('2023-12-10'),
      status: 'active'
    },
    {
      id: 'cust_004',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@gmail.com',
      phone: '+91 9876543213',
      address: 'Hitech City, Hyderabad, Telangana 500081',
      registeredCars: [
        { id: 'car_005', make: 'Tata', model: 'Nexon', year: 2022, color: 'Black', licensePlate: 'TS09IJ7890' }
      ],
      totalBookings: 6,
      totalSpent: 1800,
      joinedDate: new Date('2024-03-05'),
      status: 'inactive'
    }
  ];

  // Mock data for washers
  private mockWashers: Washer[] = [
    {
      id: 'wash_001',
      name: 'Suresh Yadav',
      email: 'suresh.yadav@gmail.com',
      phone: '+91 9876543220',
      address: 'Andheri East, Mumbai, Maharashtra 400069',
      serviceAreas: ['Andheri', 'Bandra', 'Juhu', 'Versova'],
      rating: 4.8,
      totalJobs: 145,
      totalEarnings: 87000,
      joinedDate: new Date('2023-08-15'),
      status: 'active',
      availability: 'available'
    },
    {
      id: 'wash_002',
      name: 'Ramesh Singh',
      email: 'ramesh.singh@yahoo.com',
      phone: '+91 9876543221',
      address: 'Kothrud, Pune, Maharashtra 411038',
      serviceAreas: ['Kothrud', 'Karve Nagar', 'Warje', 'Bavdhan'],
      rating: 4.6,
      totalJobs: 98,
      totalEarnings: 58800,
      joinedDate: new Date('2023-10-20'),
      status: 'active',
      availability: 'busy'
    },
    {
      id: 'wash_003',
      name: 'Vikram Joshi',
      email: 'vikram.joshi@gmail.com',
      phone: '+91 9876543222',
      address: 'Vastrapur, Ahmedabad, Gujarat 380015',
      serviceAreas: ['Vastrapur', 'Satellite', 'Bodakdev', 'Thaltej'],
      rating: 4.9,
      totalJobs: 167,
      totalEarnings: 100200,
      joinedDate: new Date('2023-07-10'),
      status: 'active',
      availability: 'available'
    },
    {
      id: 'wash_004',
      name: 'Kiran Kumar',
      email: 'kiran.kumar@hotmail.com',
      phone: '+91 9876543223',
      address: 'Gachibowli, Hyderabad, Telangana 500032',
      serviceAreas: ['Gachibowli', 'Hitech City', 'Madhapur', 'Kondapur'],
      rating: 4.4,
      totalJobs: 76,
      totalEarnings: 45600,
      joinedDate: new Date('2024-01-05'),
      status: 'active',
      availability: 'offline'
    }
  ];

  getAllCustomers(): Observable<Customer[]> {
    return of(this.mockCustomers);
  }

  getAllWashers(): Observable<Washer[]> {
    return of(this.mockWashers);
  }

  getAllBookings(): Observable<Booking[]> {
    // Generate mock bookings based on customers and washers
    const mockBookings: Booking[] = [
      {
        id: 'book_001',
        customerId: 'cust_001',
        customerName: 'Rajesh Kumar',
        washerId: 'wash_001',
        washerName: 'Suresh Yadav',
        carDetails: this.mockCustomers[0].registeredCars[0],
        serviceType: 'Premium Wash',
        servicePackage: 'Exterior + Interior + Wax',
        scheduledDate: new Date('2024-06-25'),
        scheduledTime: '10:00 AM',
        address: 'Bandra West, Mumbai, Maharashtra 400050',
        amount: 800,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdDate: new Date('2024-06-20'),
        rating: 5,
        feedback: 'Excellent service! Very professional.'
      },
      {
        id: 'book_002',
        customerId: 'cust_002',
        customerName: 'Priya Sharma',
        washerId: 'wash_002',
        washerName: 'Ramesh Singh',
        carDetails: this.mockCustomers[1].registeredCars[0],
        serviceType: 'Basic Wash',
        servicePackage: 'Exterior Wash',
        scheduledDate: new Date('2024-06-26'),
        scheduledTime: '2:00 PM',
        address: 'Koregaon Park, Pune, Maharashtra 411001',
        amount: 300,
        status: 'in-progress',
        paymentStatus: 'paid',
        createdDate: new Date('2024-06-21')
      },
      {
        id: 'book_003',
        customerId: 'cust_003',
        customerName: 'Amit Patel',
        washerId: 'wash_003',
        washerName: 'Vikram Joshi',
        carDetails: this.mockCustomers[2].registeredCars[0],
        serviceType: 'Deluxe Wash',
        servicePackage: 'Full Service + Polish',
        scheduledDate: new Date('2024-06-27'),
        scheduledTime: '11:30 AM',
        address: 'Satellite, Ahmedabad, Gujarat 380015',
        amount: 600,
        status: 'pending',
        paymentStatus: 'pending',
        createdDate: new Date('2024-06-22')
      },
      {
        id: 'book_004',
        customerId: 'cust_004',
        customerName: 'Sneha Reddy',
        washerId: 'wash_004',
        washerName: 'Kiran Kumar',
        carDetails: this.mockCustomers[3].registeredCars[0],
        serviceType: 'Express Wash',
        servicePackage: 'Quick Exterior',
        scheduledDate: new Date('2024-06-24'),
        scheduledTime: '4:00 PM',
        address: 'Hitech City, Hyderabad, Telangana 500081',
        amount: 250,
        status: 'completed',
        paymentStatus: 'paid',
        createdDate: new Date('2024-06-19'),
        completedDate: new Date('2024-06-24'),
        rating: 4,
        feedback: 'Good service, on time.'
      }
    ];

    return of(mockBookings);
  }

  getAdminStats(): Observable<any> {
    return of({
      totalCustomers: this.mockCustomers.length,
      totalWashers: this.mockWashers.length,
      totalBookings: 4,
      totalRevenue: 1950,
      activeCustomers: this.mockCustomers.filter(c => c.status === 'active').length,
      activeWashers: this.mockWashers.filter(w => w.status === 'active').length,
      pendingBookings: 1,
      completedBookings: 1
    });
  }
}
