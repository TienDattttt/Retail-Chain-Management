
package com.rsm.retailbackend.feature.voucher.controller;

import com.rsm.retailbackend.feature.common.dto.MessageResponse;
import com.rsm.retailbackend.feature.voucher.dto.VoucherCampaignDto;
import com.rsm.retailbackend.feature.voucher.service.VoucherCampaignService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/voucher-campaigns")
public class VoucherCampaignController {

    private final VoucherCampaignService campaignService;

    public VoucherCampaignController(VoucherCampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public ResponseEntity<List<VoucherCampaignDto>> getAll() {
        return ResponseEntity.ok(campaignService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherCampaignDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(campaignService.getById(id));
    }

    /**
     * Upsert: tạo mới / cập nhật / bật tắt isActive
     * Chỉ admin (role = 1)
     */
    @PreAuthorize("hasAuthority('1')")
    @PostMapping("/upsert")
    public ResponseEntity<MessageResponse> upsert(@RequestBody VoucherCampaignDto dto) {
        boolean creating = (dto.getId() == null);
        VoucherCampaignDto saved = campaignService.upsert(dto);
        String msg;
        if (creating) {
            msg = "Tạo chiến dịch voucher thành công";
        } else {
            msg = Boolean.TRUE.equals(saved.getIsActive())
                    ? "Cập nhật chiến dịch và bật hoạt động"
                    : "Cập nhật chiến dịch và đã ngưng hoạt động";
        }
        return ResponseEntity.ok(new MessageResponse(msg, saved));
    }
}
