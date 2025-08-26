const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoints
app.get('/payments/actuator/health', (req, res) => {
    res.json({ status: 'UP', service: 'Test Payment Service' });
});

app.get('/payments/health', (req, res) => {
    res.json({ status: 'UP', service: 'Test Payment Gateway' });
});

app.get('/payments/test', (req, res) => {
    res.json({ 
        message: 'Test Payment Service is working!',
        status: 'OK',
        timestamp: Date.now()
    });
});

// Create order endpoint (simulates Razorpay order creation)
app.post('/payments/create-order', (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;
    
    console.log('📦 Creating order:', { amount, currency, receipt });
    
    // Simulate Razorpay order creation
    const orderId = 'order_' + Math.random().toString(36).substr(2, 14);
    
    const response = {
        success: true,
        orderId: orderId,
        amount: amount,
        currency: currency,
        receipt: receipt || 'receipt_' + Date.now(),
        created_at: Math.floor(Date.now() / 1000),
        status: 'created'
    };
    
    console.log('✅ Order created:', response);
    res.json(response);
});

// Process payment endpoint
app.post('/payments', (req, res) => {
    console.log('💳 Processing payment:', req.body);
    
    const response = {
        success: true,
        message: 'Payment processed successfully',
        transactionId: Math.floor(Math.random() * 1000000),
        timestamp: Date.now()
    };
    
    console.log('✅ Payment processed:', response);
    res.json(response);
});

// Start single server on port 3001 (simulates both services)
const port = 3001;

app.listen(port, () => {
    console.log(`🚀 Test Payment Server running on http://localhost:${port}`);
    console.log(`📋 Health: http://localhost:${port}/payments/actuator/health`);
    console.log(`🧪 Test: http://localhost:${port}/payments/test`);
    console.log(`💳 Create Order: http://localhost:${port}/payments/create-order`);
    console.log('🎯 Test server started! Now test Razorpay integration.');
    console.log('🔧 This server simulates your Spring Boot services with proper CORS.');
});
