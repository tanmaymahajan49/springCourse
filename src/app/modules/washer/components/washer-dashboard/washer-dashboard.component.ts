import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-washer-dashboard',
  imports: [RouterOutlet, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Washer Dashboard</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <router-outlet></router-outlet>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin: 20px;
    }
  `]
})
export class WasherDashboardComponent {}
