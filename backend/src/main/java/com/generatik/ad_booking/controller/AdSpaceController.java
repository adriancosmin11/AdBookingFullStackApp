package com.generatik.ad_booking.controller;

import com.generatik.ad_booking.model.AdSpace;
import com.generatik.ad_booking.model.AdSpaceType;
import com.generatik.ad_booking.service.AdSpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ad-spaces")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permitem accesul din React
public class AdSpaceController {

    private final AdSpaceService service;

    // GET /api/v1/ad-spaces?type=BILLBOARD&city=NewYork
    @GetMapping
    public ResponseEntity<List<AdSpace>> getAllSpaces(
            @RequestParam(required = false) AdSpaceType type,
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(service.getAllSpaces(type, city));
    }

    // GET /api/v1/ad-spaces/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AdSpace> getSpaceById(@PathVariable Long id) {
        return service.getSpaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint ajutător (nu e în cerință, dar ne trebuie ca să băgăm date)
    @PostMapping
    public ResponseEntity<AdSpace> createSpace(@RequestBody AdSpace space) {
        return ResponseEntity.ok(service.save(space));
    }
}