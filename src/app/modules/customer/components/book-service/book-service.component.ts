import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    MatDividerModule
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

  cars: Car[] = [
    {
      id: '1',
      make: 'Honda',
      model: 'City',
      year: 2022,
      color: 'White',
      licensePlate: 'MH01AB1234'
    },
    {
      id: '2',
      make: 'Maruti',
      model: 'Swift',
      year: 2021,
      color: 'Red',
      licensePlate: 'MH02CD5678'
    }
  ];

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

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
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
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
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

  onSubmit(): void {
    if (this.serviceForm.valid && this.carForm.valid && this.scheduleForm.valid) {
      const bookingData = {
        service: this.selectedPackage,
        car: this.selectedCar,
        schedule: this.scheduleForm.value,
        totalPrice: this.getTotalPrice(),
        bookingId: 'BK' + Date.now(),
        status: 'Confirmed'
      };

      console.log('Booking Data:', bookingData);

      // Simulate booking process
      alert('Booking confirmed! You will receive a confirmation SMS shortly.');
      this.router.navigate(['/customer/my-bookings']);
    }
  }
}
