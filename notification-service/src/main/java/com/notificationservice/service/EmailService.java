package com.notificationservice.service;

import com.notificationservice.model.NotificationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true indicates HTML content
        helper.setFrom("tanmaymahajan2020@gmail.com");

        mailSender.send(message);
    }

    public void sendBookingConfirmationEmail(NotificationMessage notification) throws MessagingException {
        String htmlTemplate = createBookingConfirmationTemplate(notification);
        sendHtmlEmail(notification.getTo(), notification.getSubject(), htmlTemplate);
    }

    private String createBookingConfirmationTemplate(NotificationMessage notification) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Booking Confirmation</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }" +
                ".container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }" +
                ".header { background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 30px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 28px; }" +
                ".content { padding: 30px; }" +
                ".booking-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }" +
                ".detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }" +
                ".detail-label { font-weight: bold; color: #333; }" +
                ".detail-value { color: #1976d2; font-weight: 500; }" +
                ".total-section { background: #e3f2fd; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }" +
                ".total-amount { font-size: 24px; font-weight: bold; color: #1976d2; }" +
                ".footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; }" +
                ".success-icon { font-size: 48px; color: #4caf50; margin-bottom: 10px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<div class='success-icon'>✅</div>" +
                "<h1>Booking Confirmed!</h1>" +
                "<p>Thank you for choosing iTransform Car Wash</p>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + notification.getCustomerName() + ",</h2>" +
                "<p>Great news! Your car wash service has been successfully booked. Here are your booking details:</p>" +
                "<div class='booking-details'>" +
                "<h3>📋 Booking Information</h3>" +
                "<div class='detail-row'>" +
                "<span class='detail-label'>Booking ID:</span>" +
                "<span class='detail-value'>" + notification.getBookingId() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-label'>Service:</span>" +
                "<span class='detail-value'>" + notification.getServiceName() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-label'>Vehicle:</span>" +
                "<span class='detail-value'>" + notification.getCarDetails() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-label'>Date & Time:</span>" +
                "<span class='detail-value'>" + notification.getScheduledDate() + " at " + notification.getScheduledTime() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-label'>Duration:</span>" +
                "<span class='detail-value'>" + notification.getEstimatedDuration() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-label'>Location:</span>" +
                "<span class='detail-value'>" + notification.getAddress() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-label'>Contact:</span>" +
                "<span class='detail-value'>" + notification.getContactNumber() + "</span>" +
                "</div>" +
                (notification.getSpecialInstructions() != null && !notification.getSpecialInstructions().isEmpty() ?
                "<div class='detail-row'>" +
                "<span class='detail-label'>Special Instructions:</span>" +
                "<span class='detail-value'>" + notification.getSpecialInstructions() + "</span>" +
                "</div>" : "") +
                "</div>" +
                "<div class='total-section'>" +
                "<h3>💰 Total Amount</h3>" +
                "<div class='total-amount'>₹" + notification.getServicePrice() + "</div>" +
                "</div>" +
                "<p><strong>What's Next?</strong></p>" +
                "<ul>" +
                "<li>Our team will arrive at your location on the scheduled date and time</li>" +
                "<li>Please ensure your vehicle is accessible</li>" +
                "<li>You'll receive a reminder 24 hours before your appointment</li>" +
                "<li>Payment can be made after service completion</li>" +
                "</ul>" +
                "<p>If you need to reschedule or cancel, please contact us at least 2 hours before your appointment.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p><strong>iTransform Car Wash</strong></p>" +
                "<p>📧 support@itransform.com | 📞 +91 9876543210</p>" +
                "<p>Thank you for choosing our services!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
