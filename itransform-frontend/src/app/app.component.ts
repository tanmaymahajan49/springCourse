import { Component, OnInit, HostBinding, Renderer2, Inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'i-Transform Car Wash';
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<any>;

  // Theme control
  isCleanTheme = true;
  @HostBinding('class.clean-theme') get cleanTheme() { return this.isCleanTheme; }

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.applyCleanTheme();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  toggleTheme(): void {
    this.isCleanTheme = !this.isCleanTheme;
    this.applyCleanTheme();
  }

  private applyCleanTheme(): void {
    if (this.isCleanTheme) {
      this.renderer.addClass(this.document.body, 'clean-theme');
      this.renderer.removeClass(this.document.body, 'cyber-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'clean-theme');
      this.renderer.addClass(this.document.body, 'cyber-theme');
    }
  }
}
