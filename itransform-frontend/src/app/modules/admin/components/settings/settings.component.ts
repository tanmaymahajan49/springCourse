import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="settings-container">
      <div class="page-header">
        <h1>
          <mat-icon>settings</mat-icon>
          Admin Settings
        </h1>
        <p>Configure system settings and preferences</p>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div style="text-align: center; padding: 40px;">
            <mat-icon style="font-size: 64px; color: #ccc;">settings</mat-icon>
            <h2>Settings Coming Soon</h2>
            <p>Admin configuration and settings panel will be available here.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .page-header {
      margin-bottom: 32px;
    }
    
    .page-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }
    
    .page-header h1 mat-icon {
      font-size: 2rem;
      color: #667eea;
    }
    
    .page-header p {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }
  `]
})
export class SettingsComponent {}
