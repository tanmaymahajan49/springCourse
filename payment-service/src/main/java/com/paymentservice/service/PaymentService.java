package com.paymentservice.service;

import com.paymentservice.client.BookingClient;
import com.paymentservice.config.RabbitMQConfig;
import com.paymentservice.dto.PaymentDTO;
import com.paymentservice.entity.Payment;
import com.paymentservice.model.Booking;
import com.paymentservice.model.NotificationMessage;
import com.paymentservice.repository.PaymentRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private RabbitTemplate rabbitTemplate;  // Injected for sending messages

    public Payment makePayment(PaymentDTO paymentDTO) {
        Booking booking = bookingClient.getBookingById(paymentDTO.getBookingId());

        if (booking == null) {
            throw new RuntimeException("Booking not found with ID: " + paymentDTO.getBookingId());
        }

        Payment payment = new Payment();
        payment.setBookingId(booking.getId());
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentMode(paymentDTO.getPaymentMode());
        payment.setStatus("Paid");

        Payment savedPayment = paymentRepository.save(payment);

        // 🔔 Send notification
        NotificationMessage message = new NotificationMessage(
            "customer@example.com",  // Replace with booking.getCustomerEmail() if available
            "Payment Confirmation",
            "Your payment of ₹" + savedPayment.getAmount() + " was successful for booking #" + savedPayment.getBookingId()
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_QUEUE, message);

        return savedPayment;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }
}
