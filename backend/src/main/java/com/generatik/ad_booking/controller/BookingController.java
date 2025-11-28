package com.generatik.ad_booking.controller;

import com.generatik.ad_booking.model.BookingRequest;
import com.generatik.ad_booking.model.BookingStatus;
import com.generatik.ad_booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/booking-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService service;

    // POST /api/v1/booking-requests
    @PostMapping
    public ResponseEntity<BookingRequest> createBooking(@Valid @RequestBody BookingRequest request) {
        return new ResponseEntity<>(service.createBooking(request), HttpStatus.CREATED);
    }

    // GET /api/v1/booking-requests?status=PENDING
    @GetMapping
    public ResponseEntity<List<BookingRequest>> getAllBookings(
            @RequestParam(required = false) BookingStatus status) {
        return ResponseEntity.ok(service.getAllBookings(status));
    }

    // GET /api/v1/booking-requests/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BookingRequest> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getBookingById(id));
    }

    // PATCH /api/v1/booking-requests/{id}/approve
    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingRequest> approveBooking(@PathVariable Long id) {
        return ResponseEntity.ok(service.updateStatus(id, BookingStatus.APPROVED));
    }

    // PATCH /api/v1/booking-requests/{id}/reject
    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingRequest> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(service.updateStatus(id, BookingStatus.REJECTED));
    }
}