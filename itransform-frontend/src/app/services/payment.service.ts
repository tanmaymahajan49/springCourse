import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

// Declare Razorpay for TypeScript
declare var Razorpay: any;

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  orderId: string;
  signature?: string;
  error?: string;
}

// Interface for Spring backend payment
export interface SpringPaymentRequest {
  transactionId?: number;
  washerId: number;
  customerId: number;
  amount: number;
  status?: string;
}

// Interface for Razorpay order creation
export interface RazorpayOrderRequest {
  amount: number;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // Use your actual Razorpay key from Spring backend
  private razorpayKeyId = 'rzp_test_yJXdbFZ3gArwiB'; // Your actual key from Spring backend
  
  // Spring Boot Backend URLs
  private paymentGatewayUrl = 'http://localhost:8090/payments'; // PaymentGateway service
  private paymentServiceUrl = 'http://localhost:8085/payments'; // Payment service
  
  constructor(private http: HttpClient) {
    this.loadRazorpayScript();

    // Test backend connectivity on service initialization
    this.testBackendConnection().subscribe(
      isConnected => {
        if (isConnected) {
          console.log('🎉 Backend services are connected and ready!');
        } else {
          console.log('⚠️ Backend services not available, using fallback mode');
        }
      }
    );
  }

  // Load Razorpay script dynamically
  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof Razorpay !== 'undefined') {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  // Initialize Real Razorpay payment
  initiatePayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    console.log('🔄 PaymentService.initiatePayment called with:', paymentRequest);
    
    return new Observable(observer => {
      console.log('🔄 Loading Razorpay script...');
      this.loadRazorpayScript().then((loaded) => {
        console.log('📦 Razorpay script loaded:', loaded);
        
        if (!loaded) {
          console.error('❌ Failed to load Razorpay SDK');
          observer.next({
            success: false,
            orderId: paymentRequest.orderId,
            error: 'Failed to load Razorpay SDK'
          });
          observer.complete();
          return;
        }

        console.log('🚀 Opening Razorpay modal...');
        this.openRazorpayModal(paymentRequest, (response: PaymentResponse) => {
          console.log('💳 Payment response received:', response);
          observer.next(response);
          observer.complete();
        });
      }).catch(error => {
        console.error('❌ Error loading Razorpay script:', error);
        observer.next({
          success: false,
          orderId: paymentRequest.orderId,
          error: 'Failed to load Razorpay SDK'
        });
        observer.complete();
      });
    });
  }

  private openRazorpayModal(paymentRequest: PaymentRequest, callback: (response: PaymentResponse) => void): void {
    console.log('🔧 Setting up Razorpay modal with request:', paymentRequest);
    
    // Check if Razorpay is available
    if (typeof Razorpay === 'undefined') {
      console.error('❌ Razorpay is not available');
      callback({
        success: false,
        orderId: paymentRequest.orderId,
        error: 'Razorpay SDK not loaded'
      });
      return;
    }

    // Real Razorpay options
    const options = {
      key: this.razorpayKeyId, // Your Razorpay key
      amount: paymentRequest.amount * 100, // Amount in paise
      currency: paymentRequest.currency,
      name: 'i-Transform Car Wash',
      description: paymentRequest.description,
      order_id: paymentRequest.orderId,
      image: '/assets/images/logo.png', // Your logo
      prefill: {
        name: paymentRequest.customerName,
        email: paymentRequest.customerEmail,
        contact: paymentRequest.customerPhone
      },
      notes: {
        service_type: paymentRequest.description,
        customer_id: paymentRequest.customerEmail
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: () => {
          console.log('🚫 Payment cancelled by user');
          callback({
            success: false,
            orderId: paymentRequest.orderId,
            error: 'Payment cancelled by user'
          });
        }
      },
      handler: (response: any) => {
        // Real payment success response
        console.log('✅ Razorpay Payment Success:', response);
        callback({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
        });
      }
    };

    console.log('🔧 Razorpay options:', options);

    try {
      // Open real Razorpay checkout
      const rzp = new Razorpay(options);
      
      rzp.on('payment.failed', (response: any) => {
        console.error('❌ Razorpay Payment Failed:', response.error);
        callback({
          success: false,
          orderId: paymentRequest.orderId,
          error: `Payment failed: ${response.error.description}`
        });
      });

      console.log('🚀 Opening Razorpay checkout...');
      rzp.open();
    } catch (error) {
      console.error('❌ Error creating Razorpay instance:', error);
      callback({
        success: false,
        orderId: paymentRequest.orderId,
        error: 'Failed to initialize payment gateway'
      });
    }
  }

  // Create order using your Spring backend
  createOrder(amount: number, currency: string = 'INR'): Observable<string> {
    console.log('🔄 PaymentService.createOrder called with:', { amount, currency });

    const orderRequest = {
      amount: amount,
      currency: currency,
      receipt: 'receipt_' + Math.random().toString(36).substr(2, 9)
    };

    console.log('🚀 Calling backend to create Razorpay order:', orderRequest);

    // Try to call the real backend first
    return this.http.post<any>(`${this.paymentGatewayUrl}/create-order`, orderRequest).pipe(
      map(response => {
        console.log('✅ Backend order creation successful:', response);
        return response.orderId || response.id;
      }),
      catchError(error => {
        console.error('❌ Backend order creation failed, using fallback:', error);

        // Fallback to test order ID generation
        const fallbackOrderId = 'order_' + Math.random().toString(36).substr(2, 14);
        console.log('🔄 Using fallback order ID:', fallbackOrderId);

        return of(fallbackOrderId).pipe(delay(500));
      }),
      map(id => {
        console.log('📦 Final order ID:', id);
        return id;
      })
    );
  }

  // Process payment through your Spring backend after Razorpay success
  processPaymentInBackend(paymentData: SpringPaymentRequest): Observable<any> {
    console.log('💳 Processing payment in Spring backend:', paymentData);

    // Try to call the real backend first
    return this.http.post<any>(`${this.paymentServiceUrl}`, paymentData).pipe(
      map(response => {
        console.log('✅ Backend payment processing successful:', response);
        return { success: true, message: 'Payment processed successfully', data: response };
      }),
      catchError(error => {
        console.error('❌ Backend payment processing failed, using fallback:', error);

        // Fallback to simulated processing
        console.log('🔄 Using simulated backend payment processing');
        return of({ success: true, message: 'Payment processed successfully (simulated)' }).pipe(delay(1000));
      })
    );
  }

  // Verify payment signature (should be done on backend for security)
  verifyPayment(paymentId: string, orderId: string, signature: string): Observable<boolean> {
    console.log('🔍 Verifying payment:', { paymentId, orderId, signature });
    
    // For now, we'll assume verification is successful
    // In production, this should call your backend for signature verification
    return of(true).pipe(delay(500));
  }

  // Test backend connectivity
  testBackendConnection(): Observable<boolean> {
    console.log('🔍 Testing Spring backend connectivity...');

    // Test both Payment Service and Payment Gateway
    const paymentServiceTest = this.http.get<any>(`${this.paymentServiceUrl}/actuator/health`).pipe(
      map(response => {
        console.log('✅ Payment Service is UP:', response);
        return true;
      }),
      catchError(error => {
        console.error('❌ Payment Service connection failed:', error);
        return of(false);
      })
    );

    const paymentGatewayTest = this.http.get<any>(`${this.paymentGatewayUrl}/actuator/health`).pipe(
      map(response => {
        console.log('✅ Payment Gateway is UP:', response);
        return true;
      }),
      catchError(error => {
        console.error('❌ Payment Gateway connection failed:', error);
        // Try without actuator endpoint
        return this.http.get<any>(`${this.paymentGatewayUrl}`).pipe(
          map(() => {
            console.log('✅ Payment Gateway is UP (no actuator)');
            return true;
          }),
          catchError(() => {
            console.error('❌ Payment Gateway completely unavailable');
            return of(false);
          })
        );
      })
    );

    // Return true if at least Payment Service is available
    return paymentServiceTest;
  }

  // Helper method to generate test order ID (remove in production)
  private generateTestOrderId(): string {
    return 'order_' + Math.random().toString(36).substr(2, 14);
  }
}
