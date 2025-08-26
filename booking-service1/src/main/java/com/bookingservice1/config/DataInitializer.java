package com.bookingservice1.config;

import com.bookingservice1.entity.Package;
import com.bookingservice1.entity.AddOn;
import com.bookingservice1.repository.PackageRepository;
import com.bookingservice1.repository.AddOnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private AddOnRepository addOnRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize packages if not exists
        if (packageRepository.count() == 0) {
            Package basicWash = new Package("Basic Wash", "Exterior wash and dry", 300.0, 30);
            Package premiumWash = new Package("Premium Wash", "Exterior + Interior cleaning", 500.0, 60);
            Package deluxeWash = new Package("Deluxe Wash", "Complete wash with wax and polish", 800.0, 90);

            packageRepository.save(basicWash);
            packageRepository.save(premiumWash);
            packageRepository.save(deluxeWash);

            System.out.println("✅ Sample packages initialized");
        }

        // Initialize add-ons if not exists
        if (addOnRepository.count() == 0) {
            AddOn waxing = new AddOn("Car Waxing", "Premium wax coating", 150.0);
            AddOn vacuuming = new AddOn("Interior Vacuuming", "Deep vacuum cleaning", 100.0);
            AddOn tireShine = new AddOn("Tire Shine", "Tire cleaning and shine", 75.0);
            AddOn airFreshener = new AddOn("Air Freshener", "Pleasant car fragrance", 50.0);

            addOnRepository.save(waxing);
            addOnRepository.save(vacuuming);
            addOnRepository.save(tireShine);
            addOnRepository.save(airFreshener);

            System.out.println("✅ Sample add-ons initialized");
        }
    }
}
