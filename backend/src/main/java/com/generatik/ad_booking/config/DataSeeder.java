package com.generatik.ad_booking.config;

import com.generatik.ad_booking.model.AdSpace;
import com.generatik.ad_booking.model.AdSpaceStatus;
import com.generatik.ad_booking.model.AdSpaceType;
import com.generatik.ad_booking.repository.AdSpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdSpaceRepository repository;

    @Override
    public void run(String... args) throws Exception {
        // Dacă avem deja date, nu mai facem nimic
        if (repository.count() > 0) {
            return;
        }

        System.out.println("🌱 Seeding database with initial data...");

        AdSpace s1 = new AdSpace();
        s1.setName("Times Square Big Screen");
        s1.setType(AdSpaceType.BILLBOARD);
        s1.setLocation("New York, NY");
        s1.setPricePerDay(new BigDecimal("1500.00"));
        s1.setStatus(AdSpaceStatus.AVAILABLE);

        AdSpace s2 = new AdSpace();
        s2.setName("Oxford Street Stop");
        s2.setType(AdSpaceType.BUS_STOP);
        s2.setLocation("London, UK");
        s2.setPricePerDay(new BigDecimal("250.00"));
        s2.setStatus(AdSpaceStatus.AVAILABLE);

        AdSpace s3 = new AdSpace();
        s3.setName("Mall of America Display");
        s3.setType(AdSpaceType.MALL_DISPLAY);
        s3.setLocation("Bloomington, MN");
        s3.setPricePerDay(new BigDecimal("500.00"));
        s3.setStatus(AdSpaceStatus.MAINTENANCE); // Asta nu va putea fi rezervată

        repository.saveAll(List.of(s1, s2, s3));
        
        System.out.println("✅ Database populated!");
    }
}