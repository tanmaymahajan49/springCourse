# Setup Guide

## Prerequisites
Install these before running:
- Java 17+
- Node.js 16+
- MySQL Server
- RabbitMQ Server

## Database Setup
```sql
CREATE DATABASE carwash_db;
CREATE DATABASE admin_db;
CREATE DATABASE customer_db;
CREATE DATABASE washer_db;
CREATE DATABASE booking_db;
CREATE DATABASE payment_db;
```

## Configuration
Update `application.properties` in each service with your:
- Database credentials
- RabbitMQ connection
- Email SMTP settings
- Razorpay keys

## Running Order
1. Start MySQL & RabbitMQ
2. `cd serviceregistry && ./mvnw spring-boot:run`
3. `cd APIGateWay && ./mvnw spring-boot:run`
4. Start all other services
5. `cd itransform-frontend && npm install && npm start`

## Ports
- Service Registry: 8761
- API Gateway: 8080
- Frontend: 4200
- Other services: 8081-8086