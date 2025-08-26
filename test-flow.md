# 🧪 i-Transform Car Wash - End-to-End Testing Guide

## 🚀 **Complete System Flow Test**

### **Prerequisites**
1. Start all services in this order:
   - Eureka Server (port 8761)
   - API Gateway (port 8000)
   - Customer Service (port 8081)
   - Washer Service (port 8082)
   - Booking Service (port 8083)
   - Payment Service (port 8085)
   - Notification Service (port 8084)
   - Admin Service (port 8086)

### **1️⃣ Customer Journey Test**

#### **Step 1: Register Customer**
```bash
POST http://localhost:8000/api/customers/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "9876543210",
  "address": "123 Main Street, Mumbai"
}
```

#### **Step 2: Add Customer Car**
```bash
POST http://localhost:8000/api/customers/1/cars
Content-Type: application/json

{
  "make": "Honda",
  "model": "City",
  "year": "2022",
  "color": "White",
  "licensePlate": "MH01AB1234"
}
```

#### **Step 3: Get Available Packages**
```bash
GET http://localhost:8000/api/bookings/packages
```

#### **Step 4: Get Available Add-ons**
```bash
GET http://localhost:8000/api/bookings/addons
```

#### **Step 5: Create Booking**
```bash
POST http://localhost:8000/api/bookings
Content-Type: application/json

{
  "customerId": 1,
  "carId": 1,
  "packageId": 1,
  "addonIds": [1, 2],
  "preferredDateTime": "2024-01-15T10:00:00",
  "customerLocation": "Mumbai, Bandra",
  "specialInstructions": "Please call before arriving"
}
```

#### **Step 6: Validate Promo Code**
```bash
POST http://localhost:8000/api/bookings/validate-promo?promoCode=SAVE20&amount=500
```

#### **Step 7: Apply Promo Code**
```bash
POST http://localhost:8000/api/bookings/1/apply-promo?promoCode=SAVE20
```

### **2️⃣ Washer Journey Test**

#### **Step 1: Register Washer**
```bash
POST http://localhost:8000/api/washers/register
Content-Type: application/json

{
  "name": "Raj Kumar",
  "contactNumber": "9876543211",
  "email": "raj.washer@example.com",
  "city": "Mumbai",
  "address": "Bandra West, Mumbai",
  "latitude": 19.0596,
  "longitude": 72.8295
}
```

#### **Step 2: Get Washer Bookings**
```bash
GET http://localhost:8000/api/bookings/washer/1
```

#### **Step 3: Update Booking Status**
```bash
PUT http://localhost:8000/api/bookings/1/status?status=IN_PROGRESS
```

#### **Step 4: Complete Booking**
```bash
PUT http://localhost:8000/api/bookings/1/status?status=COMPLETED
```

### **3️⃣ Payment Flow Test**

#### **Step 1: Process Payment**
```bash
POST http://localhost:8000/payments
Content-Type: application/json

{
  "bookingId": 1,
  "amount": 400.0,
  "paymentMode": "UPI"
}
```

### **4️⃣ Admin Journey Test**

#### **Step 1: Get All Customers**
```bash
GET http://localhost:8000/admins/customers
```

#### **Step 2: Get All Washers**
```bash
GET http://localhost:8000/admins/washers
```

#### **Step 3: Create Package**
```bash
POST http://localhost:8000/admins/packages
Content-Type: application/json

{
  "name": "Premium Wash",
  "description": "Complete car wash with wax",
  "price": 500.0,
  "durationMinutes": 60
}
```

#### **Step 4: Create Promo**
```bash
POST http://localhost:8000/admins/promos
Content-Type: application/json

{
  "code": "SAVE20",
  "description": "20% off on all services",
  "discountType": "PERCENTAGE",
  "discountValue": 20.0,
  "minimumOrderAmount": 300.0,
  "maxUsageCount": 100,
  "validFrom": "2024-01-01T00:00:00",
  "validUntil": "2024-12-31T23:59:59"
}
```

#### **Step 5: Get Booking Reports**
```bash
GET http://localhost:8000/admins/reports/bookings
```

#### **Step 6: Get Revenue Reports**
```bash
GET http://localhost:8000/admins/reports/revenue
```

### **5️⃣ Notification Flow Test**

The notification flow is automatic and will be triggered when:
- A booking is created (confirmation email)
- Payment is processed (payment confirmation email)
- Booking status is updated

Check the notification service logs to see the email notifications being processed.

### **Expected Results**

✅ **Customer can register and add cars**
✅ **Booking is created with auto-assigned washer**
✅ **Package and addon pricing is calculated correctly**
✅ **Promo codes can be validated and applied**
✅ **Washer can update booking status**
✅ **Payment processing works**
✅ **Notifications are sent via RabbitMQ**
✅ **Admin can manage users, packages, and promos**
✅ **All services communicate via API Gateway**
✅ **Service discovery works via Eureka**

### **Troubleshooting**

1. **Service not found**: Check if Eureka Server is running and services are registered
2. **Database errors**: Ensure MySQL is running and databases are created
3. **RabbitMQ errors**: Ensure RabbitMQ server is running
4. **Port conflicts**: Check if all services are running on correct ports

This completes the comprehensive testing of the i-Transform Car Wash microservices system!
