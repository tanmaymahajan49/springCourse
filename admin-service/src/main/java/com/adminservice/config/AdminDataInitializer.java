package com.adminservice.config;

import com.adminservice.entity.Promo;
import com.adminservice.repository.PromoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    @Autowired
    private PromoRepository promoRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample promo codes if not exists
        if (promoRepository.count() == 0) {
            Promo save20 = new Promo("SAVE20", "20% off on all services", "PERCENTAGE", 20.0,
                    LocalDateTime.now(), LocalDateTime.now().plusMonths(6));
            save20.setMinimumOrderAmount(300.0);
            save20.setMaxUsageCount(100);

            Promo firstTime = new Promo("FIRST50", "₹50 off for first-time customers", "FIXED_AMOUNT", 50.0,
                    LocalDateTime.now(), LocalDateTime.now().plusMonths(12));
            firstTime.setMinimumOrderAmount(200.0);
            firstTime.setMaxUsageCount(500);

            Promo premium = new Promo("PREMIUM100", "₹100 off on premium services", "FIXED_AMOUNT", 100.0,
                    LocalDateTime.now(), LocalDateTime.now().plusMonths(3));
            premium.setMinimumOrderAmount(500.0);
            premium.setMaxUsageCount(50);

            promoRepository.save(save20);
            promoRepository.save(firstTime);
            promoRepository.save(premium);

            System.out.println("✅ Sample promo codes initialized");
        }
    }
}
