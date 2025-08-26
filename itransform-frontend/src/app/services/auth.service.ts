import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'washer' | 'admin';
  profilePicture?: string;
  address?: string;
  registeredCars?: any[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'customer' | 'washer';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Check if user is already logged in (from localStorage)
    this.loadUserFromStorage();
  }

  /**
   * Get current user data
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Login user with role-based mock data
   */
  login(credentials: LoginCredentials, userType: 'customer' | 'washer' | 'admin' = 'customer'): Promise<User> {
    return new Promise((resolve, reject) => {
      // Mock login - in real app, this would call backend API
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          let mockUser: User;

          // Check for specific admin credentials
          if (userType === 'admin' && credentials.email === 'admin@test.com' && credentials.password === 'test123') {
            mockUser = {
              id: 'admin_001',
              name: 'Admin User',
              email: 'admin@test.com',
              phone: '+91 9876543210',
              role: 'admin',
              address: 'iTransform Car Wash HQ, Mumbai'
            };
          } else if (userType === 'washer') {
            mockUser = {
              id: 'washer_' + Date.now(),
              name: this.extractNameFromEmail(credentials.email),
              email: credentials.email,
              phone: '+91 9876543210',
              role: 'washer',
              address: 'Service Area: Mumbai, Pune, Nashik',
              profilePicture: '/assets/images/washer-avatar.png'
            };
          } else if (userType === 'admin') {
            mockUser = {
              id: 'admin_' + Date.now(),
              name: this.extractNameFromEmail(credentials.email),
              email: credentials.email,
              phone: '+91 9876543210',
              role: 'admin',
              address: 'iTransform Car Wash HQ, Mumbai'
            };
          } else {
            // Default customer user
            mockUser = {
              id: 'customer_' + Date.now(),
              name: this.extractNameFromEmail(credentials.email),
              email: credentials.email,
              phone: '+91 9876543210',
              role: 'customer',
              address: '123 Main Street, Mumbai, Maharashtra 400001',
              registeredCars: [
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
              ]
            };
          }

          this.setCurrentUser(mockUser);
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  /**
   * Register new user (mock implementation)
   */
  register(userData: RegisterData): Promise<User> {
    return new Promise((resolve, reject) => {
      // Mock registration - in real app, this would call backend API
      setTimeout(() => {
        if (userData.email && userData.password && userData.name) {
          const newUser: User = {
            id: 'user_' + Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role || 'customer',
            registeredCars: []
          };
          
          this.setCurrentUser(newUser);
          resolve(newUser);
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 1000);
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
  }

  /**
   * Set current user and save to localStorage
   */
  public setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  /**
   * Load user from localStorage on app startup
   */
  private loadUserFromStorage(): void {
    // Check if we're in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user: User = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
        } catch (error) {
          console.error('Error loading user from storage:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  /**
   * Extract name from email address
   */
  private extractNameFromEmail(email: string): string {
    const username = email.split('@')[0];
    // Convert email username to proper name format
    return username
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        this.setCurrentUser(updatedUser);
        resolve(updatedUser);
      } else {
        reject(new Error('No user logged in'));
      }
    });
  }

  /**
   * Mock auto-login for development (simulates user already logged in)
   */
  mockAutoLogin(email: string = 'customer@example.com'): void {
    const mockUser: User = {
      id: 'user_mock_' + Date.now(),
      name: this.extractNameFromEmail(email),
      email: email,
      phone: '+91 9876543210',
      role: 'customer',
      address: '123 Main Street, Mumbai, Maharashtra 400001',
      registeredCars: [
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
      ]
    };
    
    this.setCurrentUser(mockUser);
    console.log('🔐 Mock auto-login successful for:', email);
  }

  /**
   * Get the appropriate dashboard route for user role
   */
  getDashboardRoute(role: string): string {
    switch (role) {
      case 'customer':
        return '/customer';
      case 'washer':
        return '/washer';
      case 'admin':
        return '/admin';
      default:
        return '/home';
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === role;
  }
}
