package com.generatik.ad_booking.repository;

import com.generatik.ad_booking.model.AdSpace;
import com.generatik.ad_booking.model.AdSpaceType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdSpaceRepository extends JpaRepository<AdSpace, Long> {

    List<AdSpace> findByTypeAndLocationContainingIgnoreCase(AdSpaceType type, String location);
    
    List<AdSpace> findByType(AdSpaceType type);
    
    List<AdSpace> findByLocationContainingIgnoreCase(String location);
}