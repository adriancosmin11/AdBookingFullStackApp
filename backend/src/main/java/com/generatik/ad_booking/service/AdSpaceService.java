package com.generatik.ad_booking.service;

import com.generatik.ad_booking.model.AdSpace;
import com.generatik.ad_booking.model.AdSpaceType;
import com.generatik.ad_booking.repository.AdSpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor // Lombok generează constructorul pentru injectare
public class AdSpaceService {

    private final AdSpaceRepository repository;

    public List<AdSpace> getAllSpaces(AdSpaceType type, String city) {
        if (type != null && city != null) {
            return repository.findByTypeAndLocationContainingIgnoreCase(type, city);
        } else if (type != null) {
            return repository.findByType(type);
        } else if (city != null) {
            return repository.findByLocationContainingIgnoreCase(city);
        }
        return repository.findAll();
    }

    public Optional<AdSpace> getSpaceById(Long id) {
        return repository.findById(id);
    }
    
    public AdSpace save(AdSpace space) {
        if (space == null) {
            throw new IllegalArgumentException("AdSpace cannot be null");
        }
        return repository.save(space);
    }
}