package com.rsm.retailbackend.feature.product.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.rsm.retailbackend.entity.*;
import com.rsm.retailbackend.exception.BusinessException;
import com.rsm.retailbackend.feature.category.repository.CategoryRepository;
import com.rsm.retailbackend.feature.product.dto.*;
import com.rsm.retailbackend.feature.product.repository.ProductAttributeRepository;
import com.rsm.retailbackend.feature.product.repository.ProductInventoryRepository;
import com.rsm.retailbackend.feature.product.repository.ProductRepository;
import com.rsm.retailbackend.feature.status.repository.StatusRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductInventoryRepository productInventoryRepository;
    private final CategoryRepository categoryRepository;
    private final Cloudinary cloudinary;
    private final StatusRepository statusRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              ProductAttributeRepository productAttributeRepository,
                              ProductInventoryRepository productInventoryRepository,
                              CategoryRepository categoryRepository,
                              Cloudinary cloudinary,
                              StatusRepository statusRepository) {
        this.productRepository = productRepository;
        this.productAttributeRepository = productAttributeRepository;
        this.productInventoryRepository = productInventoryRepository;
        this.categoryRepository = categoryRepository;
        this.cloudinary = cloudinary;
        this.statusRepository = statusRepository;
    }

    // ==================== GET ====================

    @Override
    public List<ProductDto> getAll() {
        Status active = statusRepository.findByEntityTypeAndCode("Product", "ACTIVE")
                .orElseThrow(() -> new BusinessException("Không tìm thấy trạng thái ACTIVE", HttpStatus.INTERNAL_SERVER_ERROR.value()));

        return productRepository.findByStatus(active).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getById(Integer id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy sản phẩm", HttpStatus.NOT_FOUND.value()));
        return toDto(p);
    }

    @Override
    public ProductDto getByBarcode(String barcode) {
        Product p = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new BusinessException("Không tìm thấy sản phẩm với mã vạch này", HttpStatus.NOT_FOUND.value()));
        return toDto(p);
    }

    @Override
    public List<ProductDto> getByCategory(Integer categoryId) {
        Status active = statusRepository.findByEntityTypeAndCode("Product", "ACTIVE")
                .orElseThrow(() -> new BusinessException("Không tìm thấy trạng thái ACTIVE", HttpStatus.INTERNAL_SERVER_ERROR.value()));

        return productRepository.findByCategory_IdAndStatus(categoryId, active)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchByName(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ==================== UPSERT ====================

    @Override
    public ProductDto upsert(ProductDto dto) {
        Product p;
        boolean isCreate = (dto.getId() == null);

        if (isCreate) {
            p = new Product();
            p.setCreatedDate(Instant.now());
            p.setCode((dto.getCode() == null || dto.getCode().isBlank())
                    ? "P" + System.currentTimeMillis() : dto.getCode());
        } else {
            p = productRepository.findById(dto.getId())
                    .orElseThrow(() -> new BusinessException("Không tìm thấy sản phẩm để cập nhật", HttpStatus.NOT_FOUND.value()));
            p.setModifiedDate(Instant.now());
            if (dto.getCode() != null) p.setCode(dto.getCode());
        }

        // name
        if (dto.getName() != null) p.setName(dto.getName());

        // category
        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new BusinessException("Danh mục không tồn tại", HttpStatus.BAD_REQUEST.value()));
            p.setCategory(cat);
        }

        // price
        p.setBasePrice(dto.getBasePrice() != null ? dto.getBasePrice() : BigDecimal.ZERO);
        p.setRetailPrice(dto.getRetailPrice() != null ? dto.getRetailPrice() : BigDecimal.ZERO);
        p.setWeight(dto.getWeight());
        p.setUnit(dto.getUnit());
        p.setAllowsSale(dto.getAllowsSale() != null ? dto.getAllowsSale() : Boolean.TRUE);
        p.setDescription(dto.getDescription());

        // === STATUS mapping ===
        Status status;
        if (isCreate) {
            status = statusRepository.findByEntityTypeAndCode("Product", "ACTIVE")
                    .orElseThrow(() -> new BusinessException("Không tìm thấy trạng thái ACTIVE", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        } else if (dto.getStatusCode() != null) {
            status = statusRepository.findByEntityTypeAndCode("Product", dto.getStatusCode())
                    .orElseThrow(() -> new BusinessException("Trạng thái không hợp lệ", HttpStatus.BAD_REQUEST.value()));
        } else {
            status = p.getStatus(); // giữ nguyên nếu không gửi code
        }
        p.setStatus(status);

        // === BARCODE ===
        if (dto.getBarcode() != null && !dto.getBarcode().isBlank()) {
            p.setBarcode(dto.getBarcode());
        } else if (Boolean.TRUE.equals(dto.getAutoGenerateBarcode())) {
            String newBarcode = BarcodeGenerator.generate13Digits();
            while (productRepository.existsByBarcode(newBarcode)) {
                newBarcode = BarcodeGenerator.generate13Digits();
            }
            p.setBarcode(newBarcode);
        }

        // === SAVE ===
        Product saved = productRepository.save(p);

        // === Attributes ===
        if (dto.getAttributes() != null) {
            productAttributeRepository.deleteByProduct_Id(saved.getId());
            for (ProductAttributeDto adto : dto.getAttributes()) {
                ProductAttribute pa = new ProductAttribute();
                pa.setProduct(saved);
                pa.setAttributeName(adto.getAttributeName());
                pa.setAttributeValue(adto.getAttributeValue());
                productAttributeRepository.save(pa);
            }
        }

        return toDto(saved);
    }

    // ==================== GET CHILD ENTITIES ====================

    @Override
    public List<ProductAttributeDto> getAttributes(Integer productId) {
        return productAttributeRepository.findByProduct_Id(productId)
                .stream()
                .map(pa -> new ProductAttributeDto(pa.getId(), pa.getAttributeName(), pa.getAttributeValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductInventoryDto> getInventories(Integer productId) {
        return productInventoryRepository.findByProduct_Id(productId)
                .stream()
                .map(pi -> ProductInventoryDto.builder()
                        .branchId(pi.getBranch() != null ? pi.getBranch().getId() : null)
                        .warehouseId(pi.getWarehouse() != null ? pi.getWarehouse().getId() : null)
                        .onHand(pi.getOnHand())
                        .reserved(pi.getReserved())
                        .available(pi.getAvailable())
                        .lastUpdated(pi.getLastUpdated())
                        .build())
                .collect(Collectors.toList());
    }

    // ==================== BULK ====================

    @Override
    public void bulkCreate(ProductBulkCreateDto dto) {
        if (dto.getItems() == null) return;
        for (ProductDto p : dto.getItems()) {
            p.setId(null);
            upsert(p);
        }
    }

    @Override
    public void bulkUpdate(ProductBulkUpdateDto dto) {
        if (dto.getItems() == null) return;
        for (ProductDto p : dto.getItems()) {
            if (p.getId() == null) {
                throw new BusinessException("Bulk update yêu cầu mỗi sản phẩm phải có id", HttpStatus.BAD_REQUEST.value());
            }
            upsert(p);
        }
    }

    // ==================== IMAGE UPLOAD ====================

    @Override
    public String uploadImage(Integer productId, byte[] bytes, String originalFilename) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy sản phẩm", HttpStatus.NOT_FOUND.value()));

        try {
            Map uploadResult = cloudinary.uploader().upload(bytes,
                    ObjectUtils.asMap(
                            "folder", "retail/products",
                            "public_id", "product_" + productId
                    ));
            String url = (String) uploadResult.get("secure_url");
            p.setImageUrl(url);
            p.setModifiedDate(Instant.now());
            productRepository.save(p);
            return url;
        } catch (IOException e) {
            throw new BusinessException("Upload ảnh thất bại", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    // ==================== DTO MAPPING ====================

    private ProductDto toDto(Product p) {
        List<ProductAttributeDto> attrs = productAttributeRepository.findByProduct_Id(p.getId())
                .stream()
                .map(a -> new ProductAttributeDto(a.getId(), a.getAttributeName(), a.getAttributeValue()))
                .collect(Collectors.toList());

        return ProductDto.builder()
                .id(p.getId())
                .code(p.getCode())
                .name(p.getName())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .basePrice(p.getBasePrice())
                .retailPrice(p.getRetailPrice())
                .weight(p.getWeight())
                .unit(p.getUnit())
                .allowsSale(p.getAllowsSale())
                .statusId(p.getStatus() != null ? p.getStatus().getId() : null)
                .statusCode(p.getStatus() != null ? p.getStatus().getCode() : null)
                .description(p.getDescription())
                .barcode(p.getBarcode())
                .imageUrl(p.getImageUrl())
                .createdDate(p.getCreatedDate())
                .modifiedDate(p.getModifiedDate())
                .attributes(attrs)
                .build();
    }
}
