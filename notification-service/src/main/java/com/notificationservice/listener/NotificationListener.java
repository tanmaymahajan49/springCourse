package com.notificationservice.listener;

import com.notificationservice.config.RabbitMQConfig;
import com.notificationservice.model.NotificationMessage;
import com.notificationservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    @Autowired
    private EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void consumeMessage(NotificationMessage message) {
        System.out.println("📩 Notification received:");
        System.out.println("To: " + message.getTo());
        System.out.println("Subject: " + message.getSubject());
        System.out.println("Type: " + message.getType());

        try {
            if ("booking-confirmation".equals(message.getType())) {
                System.out.println("🎉 Sending booking confirmation email...");
                emailService.sendBookingConfirmationEmail(message);
                System.out.println("✅ Booking confirmation email sent successfully!");
            } else {
                // Fallback to simple email
                System.out.println("📧 Sending simple email...");
                emailService.sendEmail(message.getTo(), message.getSubject(), message.getBody());
                System.out.println("✅ Simple email sent successfully!");
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
