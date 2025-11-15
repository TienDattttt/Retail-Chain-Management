package com.rsm.retailbackend.feature.purchase.dto;

import lombok.Data;
import java.util.List;

@Data
public class PurchaseOrderPrintDto {

    private Integer purchaseOrderId;
    private String purchaseOrderCode;
    private String purchaseDate;
    private String expectedDeliveryDate;
    private String deliveryDate;
    private String description;
    private Double total;
    private Double totalPayment;
    private Double discount;
    private Double discountRatio;

    private SupplierInfo supplier;
    private WarehouseInfo warehouse;
    private List<ItemInfo> items;

    @Data
    public static class SupplierInfo {
        private Integer supplierId;
        private String name;
        private String address;
        private String phone;
    }

    @Data
    public static class WarehouseInfo {
        private Integer warehouseId;
        private String name;
        private String address;
    }

    @Data
    public static class ItemInfo {
        private Integer detailId;
        private Integer productId;
        private String name;
        private String description;
        private Double unitPrice;
        private Integer quantity;
        private Double total;
        private String expiredDate;
    }
}
