package com.generatik.ad_booking.service;

import com.generatik.ad_booking.model.*;
import com.generatik.ad_booking.repository.AdSpaceRepository;
import com.generatik.ad_booking.repository.BookingRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRequestRepository bookingRepository;
    private final AdSpaceRepository adSpaceRepository;

    @Transactional
    public BookingRequest createBooking(BookingRequest request) {
        // 1. Găsim spațiul publicitar
        AdSpace space = adSpaceRepository.findById(request.getAdSpace().getId())
                .orElseThrow(() -> new IllegalArgumentException("Ad Space not found"));
        
        // 2. Validare: Spațiul trebuie să fie 'Available' [cite: 30]
        if (space.getStatus() != AdSpaceStatus.AVAILABLE) {
            throw new IllegalStateException("This ad space is currently not available for booking.");
        }

        // 3. Validare: End date după Start date [cite: 29]
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date.");
        }

        // 4. Validare: Durata minimă 7 zile [cite: 32]
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days < 7) {
            throw new IllegalArgumentException("Minimum booking duration is 7 days.");
        }

        // 5. Validare: Suprapunere cu rezervări aprobate 
        List<BookingRequest> conflicts = bookingRepository.findOverlappingBookings(
                space.getId(), request.getStartDate(), request.getEndDate());
        
        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Selected dates overlap with an existing approved booking.");
        }

        // 6. Calcul cost total [cite: 25]
        BigDecimal totalCost = space.getPricePerDay().multiply(BigDecimal.valueOf(days));
        request.setTotalCost(totalCost);
        
        // 7. Setări default
        request.setAdSpace(space); // Asigurăm relația
        request.setStatus(BookingStatus.PENDING); // [cite: 34]

        return bookingRepository.save(request);
    }
    
    // Metode pentru aprobare/respingere
    public BookingRequest updateStatus(Long id, BookingStatus newStatus) {
        BookingRequest booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        // Doar PENDING se poate modifica [cite: 35]
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be processed.");
        }

        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }

    public List<BookingRequest> getAllBookings(BookingStatus status) {
        if (status != null) {
            return bookingRepository.findByStatus(status);
        }
        return bookingRepository.findAll();
    }
    
    public BookingRequest getBookingById(Long id) {
        return bookingRepository.findById(id)
             .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }
}