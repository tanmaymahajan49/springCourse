import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Create spies for dependencies
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'setCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedUserType).toBe('customer');
    expect(component.isLoading).toBeFalsy();
    expect(component.loginForm).toBeTruthy();
  });

  it('should handle successful login', async () => {
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210'
    };

    mockAuthService.login.and.returnValue(Promise.resolve(mockUser));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    await component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/customer']);
  });

  it('should handle failed login', async () => {
    mockAuthService.login.and.returnValue(Promise.reject(new Error('Invalid credentials')));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    await component.onSubmit();

    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should select user type correctly', () => {
    component.selectedUserType = 'washer';
    expect(component.selectedUserType).toBe('washer');

    component.selectedUserType = 'admin';
    expect(component.selectedUserType).toBe('admin');
  });

  it('should execute quick test washer correctly', () => {
    component.quickTestWasher();

    expect(mockAuthService.setCurrentUser).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/washer']);
  });
});
