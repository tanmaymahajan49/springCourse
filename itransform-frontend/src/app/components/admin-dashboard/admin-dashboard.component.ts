import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="admin-dashboard">
      <mat-toolbar color="primary">
        <span>Admin Dashboard</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Welcome, Admin!</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Admin dashboard is coming soon...</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      height: 100vh;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .dashboard-content {
      padding: 20px;
    }
  `]
})
export class AdminDashboardComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
