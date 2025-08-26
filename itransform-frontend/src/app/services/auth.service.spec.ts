import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login customer successfully', async () => {
    const credentials = { email: 'customer@example.com', password: 'password123' };
    const result = await service.login(credentials, 'customer');
    expect(result).toBeTruthy();
    expect(result.role).toBe('customer');
  });

  it('should get current user', () => {
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210'
    };
    service.setCurrentUser(mockUser);
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBeFalsy();
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210'
    };
    service.setCurrentUser(mockUser);
    expect(service.isLoggedIn()).toBeTruthy();
  });

  it('should logout user', () => {
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
      phone: '+91 9876543210'
    };
    service.setCurrentUser(mockUser);
    service.logout();
    expect(service.isLoggedIn()).toBeFalsy();
  });
});