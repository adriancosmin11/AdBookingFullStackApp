package com.generatik.ad_booking.repository;

import com.generatik.ad_booking.model.BookingRequest;
import com.generatik.ad_booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    // Verificăm dacă există rezervări APROBATE care se suprapun cu intervalul cerut
    @Query("SELECT b FROM BookingRequest b WHERE " +
           "b.adSpace.id = :spaceId " +
           "AND b.status = 'APPROVED' " +
           "AND (b.startDate <= :endDate AND b.endDate >= :startDate)")
    List<BookingRequest> findOverlappingBookings(
            @Param("spaceId") Long spaceId, 
            @Param("startDate") LocalDate startDate, 
            @Param("endDate") LocalDate endDate
    );
    
    List<BookingRequest> findByStatus(BookingStatus status);
}