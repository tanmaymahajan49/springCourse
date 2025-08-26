package com.notificationservice.controller;

import com.notificationservice.config.RabbitMQConfig;
import com.notificationservice.model.NotificationMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notify")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @PostMapping
    public String sendNotification(@RequestParam String message) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_QUEUE, message);
        return "Message sent to notification queue.";
    }

    @PostMapping("/booking-confirmation")
    public ResponseEntity<String> sendBookingConfirmation(@RequestBody NotificationMessage notification) {
        try {
            notification.setType("booking-confirmation");
            rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_QUEUE, notification);

            System.out.println("🚀 Booking confirmation queued for: " + notification.getTo());

            return ResponseEntity.ok("Booking confirmation email queued successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to queue booking confirmation: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to queue email: " + e.getMessage());
        }
    }

    @PostMapping("/simple-email")
    public ResponseEntity<String> sendSimpleEmail(@RequestBody NotificationMessage notification) {
        try {
            notification.setType("simple");
            rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_QUEUE, notification);

            System.out.println("📧 Simple email queued for: " + notification.getTo());

            return ResponseEntity.ok("Email queued successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to queue email: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to queue email: " + e.getMessage());
        }
    }
}
