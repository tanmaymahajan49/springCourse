import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all bookings as observable', (done) => {
    service.getAllBookings().subscribe(bookings => {
      expect(bookings.length).toBe(4);
      expect(bookings[0].bookingId).toBe('BK001');
      expect(bookings[0].customerName).toBe('Rajesh Kumar');
      done();
    });
  });

  it('should get available bookings', (done) => {
    service.getAvailableBookings().subscribe(bookings => {
      expect(bookings.length).toBe(2);
      expect(bookings.every(b => b.status === 'PENDING')).toBeTruthy();
      done();
    });
  });

  it('should get booking by ID', (done) => {
    service.getBookingById('1').subscribe(booking => {
      expect(booking).toBeTruthy();
      expect(booking?.bookingId).toBe('BK001');
      expect(booking?.customerName).toBe('Rajesh Kumar');
      done();
    });
  });

  it('should assign booking to washer', async () => {
    const result = await service.assignBookingToWasher('1', 'washer123', 'John Doe', '+91 9876543210');
    expect(result).toBeTruthy();
    expect(result.status).toBe('ASSIGNED');
    expect(result.washerName).toBe('John Doe');
  });

  it('should update booking status', async () => {
    const result = await service.updateBookingStatus('1', 'COMPLETED');
    expect(result).toBeTruthy();
    expect(result.status).toBe('COMPLETED');
  });
});
