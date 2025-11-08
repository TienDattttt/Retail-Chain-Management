package com.rsm.retailbackend.feature.payment.client;

import com.rsm.retailbackend.feature.payment.dto.CreateMomoRequest;
import com.rsm.retailbackend.feature.payment.dto.CreateMomoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "momo", url = "${momo.endpoint}")
public interface MomoApi {
    @PostMapping("/create")
    CreateMomoResponse createMomoQR(@RequestBody CreateMomoRequest createMomoRequest);
}
