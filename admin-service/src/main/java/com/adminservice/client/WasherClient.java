package com.adminservice.client;

import com.adminservice.model.Washer;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "WASHER-SERVICE")
public interface WasherClient {

    @GetMapping("/api/washers/{id}")
    Washer getWasherById(@PathVariable("id") Long id);

    @GetMapping("/api/washers/getAll")
    List<Washer> getAllWashers();

    @PutMapping("/api/washers/{id}/status")
    Washer updateWasherStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
