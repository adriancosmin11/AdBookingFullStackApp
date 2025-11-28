package com.generatik.ad_booking;

import com.generatik.ad_booking.model.AdSpace;
import com.generatik.ad_booking.model.AdSpaceStatus;
import com.generatik.ad_booking.model.BookingRequest;
import com.generatik.ad_booking.repository.AdSpaceRepository;
import com.generatik.ad_booking.repository.BookingRequestRepository;
import com.generatik.ad_booking.service.BookingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRequestRepository bookingRepository;

    @Mock
    private AdSpaceRepository adSpaceRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void shouldThrowError_WhenBookingDurationIsLessThan7Days() {
        // ARRANGE (Pregatim datele)
        AdSpace space = new AdSpace();
        space.setId(1L);
        space.setStatus(AdSpaceStatus.AVAILABLE);
        space.setPricePerDay(BigDecimal.TEN);

        BookingRequest request = new BookingRequest();
        request.setAdSpace(space);
        request.setStartDate(LocalDate.now().plusDays(1));
        request.setEndDate(LocalDate.now().plusDays(3)); // Doar 2 zile diferență

        when(adSpaceRepository.findById(1L)).thenReturn(Optional.of(space));

        // ACT & ASSERT (Verificăm dacă aruncă eroarea)
        assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(request);
        }, "Should throw exception for short bookings");
    }
}