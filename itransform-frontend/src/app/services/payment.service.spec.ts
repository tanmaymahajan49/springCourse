import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaymentService, PaymentRequest, PaymentResponse } from './payment.service';

// Mock Razorpay for testing
declare global {
  interface Window {
    Razorpay: any;
  }
}

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;
  let mockRazorpay: jasmine.Spy;

  beforeEach(() => {
    // Configure TestBed - Angular's testing utility
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Mock HTTP client
      providers: [PaymentService]
    });
    
    // Inject service and HTTP testing controller
    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock Razorpay constructor
    mockRazorpay = jasmine.createSpy('Razorpay').and.returnValue({
      open: jasmine.createSpy('open'),
      on: jasmine.createSpy('on')
    });
    
    // Mock global Razorpay
    (window as any).Razorpay = mockRazorpay;
  });

  afterEach(() => {
    // Verify no outstanding HTTP requests
    httpMock.verify();
    // Clean up global mocks
    delete (window as any).Razorpay;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createOrder', () => {
    it('should generate order ID successfully', (done) => {
      const amount = 500;
      const currency = 'INR';

      service.createOrder(amount, currency).subscribe(orderId => {
        expect(orderId).toBeTruthy();
        expect(orderId).toContain('order_');
        expect(orderId.length).toBeGreaterThan(10);
        done();
      });
    });

    it('should use default currency when not provided', (done) => {
      const amount = 300;

      service.createOrder(amount).subscribe(orderId => {
        expect(orderId).toBeTruthy();
        expect(orderId).toContain('order_');
        done();
      });
    });
  });

  describe('initiatePayment', () => {
    let paymentRequest: PaymentRequest;

    beforeEach(() => {
      paymentRequest = {
        amount: 599,
        currency: 'INR',
        orderId: 'order_test123',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+91 9876543210',
        description: 'Premium Car Wash'
      };
    });

    it('should initiate payment with Razorpay when SDK is loaded', (done) => {
      // Mock successful script loading
      spyOn(service as any, 'loadRazorpayScript').and.returnValue(Promise.resolve(true));
      spyOn(service as any, 'openRazorpayModal').and.callFake((req: PaymentRequest, callback: Function) => {
        callback({
          success: true,
          paymentId: 'pay_test123',
          orderId: req.orderId,
          signature: 'sig_test123'
        });
      });

      service.initiatePayment(paymentRequest).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.paymentId).toBe('pay_test123');
        expect(response.orderId).toBe('order_test123');
        done();
      });
    });

    it('should handle Razorpay SDK loading failure', (done) => {
      // Mock failed script loading
      spyOn(service as any, 'loadRazorpayScript').and.returnValue(Promise.resolve(false));

      service.initiatePayment(paymentRequest).subscribe(response => {
        expect(response.success).toBeFalsy();
        expect(response.error).toBe('Failed to load Razorpay SDK');
        done();
      });
    });

    it('should handle payment cancellation', (done) => {
      spyOn(service as any, 'loadRazorpayScript').and.returnValue(Promise.resolve(true));
      spyOn(service as any, 'openRazorpayModal').and.callFake((req: PaymentRequest, callback: Function) => {
        callback({
          success: false,
          orderId: req.orderId,
          error: 'Payment cancelled by user'
        });
      });

      service.initiatePayment(paymentRequest).subscribe(response => {
        expect(response.success).toBeFalsy();
        expect(response.error).toBe('Payment cancelled by user');
        done();
      });
    });
  });

  describe('processPaymentInBackend', () => {
    it('should simulate successful backend processing', (done) => {
      const paymentData = {
        washerId: 1,
        customerId: 1,
        amount: 599,
        status: 'COMPLETED'
      };

      service.processPaymentInBackend(paymentData).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Payment processed successfully');
        done();
      });
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment successfully', (done) => {
      const paymentId = 'pay_test123';
      const orderId = 'order_test123';
      const signature = 'sig_test123';

      service.verifyPayment(paymentId, orderId, signature).subscribe(isValid => {
        expect(isValid).toBeTruthy();
        done();
      });
    });
  });

  describe('testBackendConnection', () => {
    it('should test backend connectivity successfully', () => {
      const mockResponse = { status: 'OK', message: 'Payment service is running' };

      service.testBackendConnection().subscribe(isConnected => {
        expect(isConnected).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:8085/payments');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle backend connection failure', () => {
      service.testBackendConnection().subscribe(isConnected => {
        expect(isConnected).toBeFalsy();
      });

      const req = httpMock.expectOne('http://localhost:8085/payments');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('Razorpay Integration', () => {
    it('should configure Razorpay options correctly', () => {
      const paymentRequest: PaymentRequest = {
        amount: 299,
        currency: 'INR',
        orderId: 'order_test456',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+91 9876543210',
        description: 'Basic Car Wash'
      };

      // Mock the private method to test Razorpay configuration
      const openRazorpayModalSpy = spyOn(service as any, 'openRazorpayModal').and.callFake(
        (req: PaymentRequest, callback: Function) => {
          // Verify Razorpay is called with correct options
          expect(mockRazorpay).toHaveBeenCalledWith(jasmine.objectContaining({
            key: 'rzp_test_yJXdbFZ3gArwiB',
            amount: 29900, // Amount in paise
            currency: 'INR',
            name: 'i-Transform Car Wash',
            description: 'Basic Car Wash',
            order_id: 'order_test456'
          }));
          
          callback({ success: true, paymentId: 'pay_test456', orderId: 'order_test456' });
        }
      );

      spyOn(service as any, 'loadRazorpayScript').and.returnValue(Promise.resolve(true));

      service.initiatePayment(paymentRequest).subscribe();
    });
  });
});
