package com.rsm.retailbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "StockReturnDetails")
public class StockReturnDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StockReturnDetailId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "StockReturnId", nullable = false)
    private StockReturn stockReturn;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ProductId", nullable = false)
    private Product product;

    @NotNull
    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @Column(name = "ExpiredDate")
    private LocalDate expiredDate;

}