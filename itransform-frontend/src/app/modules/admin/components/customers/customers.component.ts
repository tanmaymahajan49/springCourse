import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminService, Customer } from '../../services/admin.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'cars', 'bookings', 'spent', 'status', 'actions'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.adminService.getAllCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  // Helper methods for template
  getActiveCustomersCount(): number {
    return this.customers.filter(c => c.status === 'active').length;
  }

  getTotalRevenue(): number {
    return this.customers.reduce((sum, c) => sum + c.totalSpent, 0);
  }

  getTotalCars(): number {
    return this.customers.reduce((sum, c) => sum + c.registeredCars.length, 0);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      default: return 'accent';
    }
  }

  viewCustomerDetails(customer: Customer): void {
    console.log('View customer details:', customer);
    // TODO: Implement customer details modal or navigation
  }

  editCustomer(customer: Customer): void {
    console.log('Edit customer:', customer);
    // TODO: Implement customer edit functionality
  }

  deleteCustomer(customer: Customer): void {
    console.log('Delete customer:', customer);
    // TODO: Implement customer delete functionality
  }
}
