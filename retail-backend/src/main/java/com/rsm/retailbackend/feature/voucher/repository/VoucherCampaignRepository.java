// feature/voucher/repository/VoucherCampaignRepository.java
package com.rsm.retailbackend.feature.voucher.repository;

import com.rsm.retailbackend.entity.VoucherCampaign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherCampaignRepository extends JpaRepository<VoucherCampaign, Integer> {
    boolean existsByCode(String code);
}
