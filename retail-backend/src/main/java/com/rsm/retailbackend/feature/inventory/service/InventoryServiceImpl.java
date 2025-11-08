package com.rsm.retailbackend.feature.inventory.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final JdbcTemplate jdbcTemplate;

    public InventoryServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void deductInventoryForSale(Integer branchId, Integer productId, Integer quantity) {
        String sql = "EXEC sp_DeductInventoryForSale @BranchId=?, @ProductId=?, @Quantity=?";

        try {
            jdbcTemplate.update(sql, branchId, productId, quantity);
            System.out.printf("Đã trừ tồn kho sản phẩm ID=%d tại chi nhánh %d, SL=%d%n",
                    productId, branchId, quantity);
        } catch (Exception e) {
            System.err.printf("Lỗi trừ tồn kho: %s%n", e.getMessage());
            throw new RuntimeException("Không thể cập nhật tồn kho: " + e.getMessage());
        }
    }
}
