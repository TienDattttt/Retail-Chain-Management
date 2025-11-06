package com.rsm.retailbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "ProductAttributes")
public class ProductAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductAttributeId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ProductId", nullable = false)
    private Product product;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "AttributeName", nullable = false, length = 100)
    private String attributeName;

    @Size(max = 200)
    @NotNull
    @Nationalized
    @Column(name = "AttributeValue", nullable = false, length = 200)
    private String attributeValue;

}