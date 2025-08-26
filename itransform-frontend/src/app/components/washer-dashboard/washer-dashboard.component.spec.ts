import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WasherDashboardComponent } from './washer-dashboard.component';

describe('WasherDashboardComponent', () => {
  let component: WasherDashboardComponent;
  let fixture: ComponentFixture<WasherDashboardComponent>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Create spy for MatSnackBar
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        WasherDashboardComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WasherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.availableBookings.length).toBe(2);
    expect(component.myBookings.length).toBe(0);
    expect(component.completedBookings.length).toBe(0);
    expect(component.todayEarnings).toBe(0);
    expect(component.totalJobs).toBe(0);
    expect(component.pendingJobs).toBe(0);
    expect(component.completedJobs).toBe(0);
  });

  it('should display welcome message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const welcomeTitle = compiled.querySelector('mat-card-title');
    expect(welcomeTitle?.textContent).toContain('Welcome, Test Washer!');
  });

  it('should display statistics cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statCards = compiled.querySelectorAll('.stat-card');
    expect(statCards.length).toBe(4);
  });

  it('should accept booking correctly', () => {
    const mockBooking = {
      id: '1',
      bookingId: 'BK001',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh.kumar@gmail.com',
      serviceName: 'Premium Car Wash',
      servicePrice: 799,
      status: 'PENDING'
    } as any;

    component.availableBookings = [mockBooking];
    component.myBookings = [];

    spyOn(console, 'log');

    component.acceptBooking(mockBooking);

    expect(component.availableBookings.length).toBe(0);
    expect(component.myBookings.length).toBe(1);
    expect(component.myBookings[0].status).toBe('ASSIGNED');
    expect(mockSnackBar.open).toHaveBeenCalled();
  });

  it('should complete job correctly', () => {
    const mockBooking = {
      id: '1',
      bookingId: 'BK001',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh.kumar@gmail.com',
      serviceName: 'Premium Car Wash',
      servicePrice: 799,
      status: 'ASSIGNED',
      washerName: 'Test Washer'
    } as any;

    component.myBookings = [mockBooking];
    component.completedBookings = [];

    spyOn(console, 'log');

    component.completeJob(mockBooking);

    expect(component.myBookings.length).toBe(0);
    expect(component.completedBookings.length).toBe(1);
    expect(component.completedBookings[0].status).toBe('COMPLETED');
    expect(mockSnackBar.open).toHaveBeenCalled();
  });
});
