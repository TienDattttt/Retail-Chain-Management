
package com.rsm.retailbackend.feature.voucher.repository;

import com.rsm.retailbackend.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    Optional<Voucher> findByCode(String code);
    List<Voucher> findByVoucherCampaignId(Integer campaignId);
}
