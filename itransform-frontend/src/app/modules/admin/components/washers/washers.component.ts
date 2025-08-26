import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminService, Washer } from '../../services/admin.service';

@Component({
  selector: 'app-washers',
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
    MatProgressBarModule
  ],
  templateUrl: './washers.component.html',
  styleUrls: ['./washers.component.scss']
})
export class WashersComponent implements OnInit {
  washers: Washer[] = [];
  displayedColumns: string[] = ['name', 'contact', 'areas', 'rating', 'jobs', 'earnings', 'status', 'availability', 'actions'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadWashers();
  }

  loadWashers(): void {
    this.adminService.getAllWashers().subscribe(washers => {
      this.washers = washers;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      case 'suspended': return 'accent';
      default: return 'basic';
    }
  }

  getAvailabilityColor(availability: string): string {
    switch (availability) {
      case 'available': return 'primary';
      case 'busy': return 'warn';
      case 'offline': return 'accent';
      default: return 'basic';
    }
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    
    if (hasHalfStar) {
      stars.push('star_half');
    }
    
    while (stars.length < 5) {
      stars.push('star_border');
    }
    
    return stars;
  }

  viewWasherDetails(washer: Washer): void {
    console.log('View washer details:', washer);
    // TODO: Implement washer details modal or navigation
  }

  editWasher(washer: Washer): void {
    console.log('Edit washer:', washer);
    // TODO: Implement washer edit functionality
  }

  suspendWasher(washer: Washer): void {
    console.log('Suspend washer:', washer);
    // TODO: Implement washer suspension functionality
  }

  // Helper methods for template
  getActiveWashersCount(): number {
    return this.washers.filter(w => w.status === 'active').length;
  }

  getAvailableWashersCount(): number {
    return this.washers.filter(w => w.availability === 'available').length;
  }

  getTotalEarnings(): number {
    return this.washers.reduce((sum, w) => sum + w.totalEarnings, 0);
  }
}
