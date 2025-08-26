package com.bookingservice1.client;

import com.bookingservice1.dto.PromoValidationRequest;
import com.bookingservice1.dto.PromoValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ADMIN-SERVICE")
public interface AdminClient {

    @PostMapping("/admins/promos/validate")
    PromoValidationResponse validatePromoCode(@RequestBody PromoValidationRequest request);
}
