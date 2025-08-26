import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule]
    });
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send booking confirmation', (done) => {
    const bookingData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      bookingId: 'BK001',
      serviceName: 'Premium Car Wash',
      servicePrice: 799,
      carDetails: '2022 Honda City',
      scheduledDate: '2024-01-15',
      scheduledTime: '10:00 AM',
      address: 'Test Address',
      contactNumber: '+91 9876543210',
      estimatedDuration: '45 minutes'
    };

    service.sendBookingConfirmation(bookingData).subscribe(result => {
      expect(result).toBeDefined();
      done();
    });
  });

  it('should send booking assigned email successfully', async () => {
    const bookingData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      bookingId: 'BK001',
      serviceName: 'Premium Car Wash',
      washerName: 'Test Washer',
      washerPhone: '+91 9876543210'
    } as any;

    spyOn(console, 'log');
    const result = await service.sendBookingAssignedEmail(bookingData);

    expect(result.success).toBeTruthy();
    expect(console.log).toHaveBeenCalledWith('📧 Sending booking assigned email...');
  });

  it('should send job completed email successfully', async () => {
    const bookingData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      bookingId: 'BK001',
      serviceName: 'Premium Car Wash',
      washerName: 'Test Washer',
      servicePrice: 799
    } as any;

    spyOn(console, 'log');
    const result = await service.sendJobCompletedEmail(bookingData);

    expect(result.success).toBeTruthy();
    expect(console.log).toHaveBeenCalledWith('📧 Sending job completed email...');
  });
});
