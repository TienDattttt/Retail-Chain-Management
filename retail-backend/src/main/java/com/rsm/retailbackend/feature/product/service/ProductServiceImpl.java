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
import com.rsm.retailbackend.feature.product.repository.ProductUnitRepository;
import com.rsm.retailbackend.feature.status.repository.StatusRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final ProductUnitRepository productUnitRepository;
    private final ProductInventoryRepository productInventoryRepository;
    private final CategoryRepository categoryRepository;
    private final Cloudinary cloudinary;
    private final StatusRepository statusRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              ProductAttributeRepository productAttributeRepository,
                              ProductUnitRepository productUnitRepository,
                              ProductInventoryRepository productInventoryRepository,
                              CategoryRepository categoryRepository,
                              Cloudinary cloudinary,
                              StatusRepository statusRepository) {
        this.productRepository = productRepository;
        this.productAttributeRepository = productAttributeRepository;
        this.productUnitRepository = productUnitRepository;
        this.productInventoryRepository = productInventoryRepository;
        this.categoryRepository = categoryRepository;
        this.cloudinary = cloudinary;
        this.statusRepository = statusRepository;
    }

    // ==================== GET ====================

    @Override
    public List<ProductDto> getAll() {
        // Lấy tất cả sản phẩm trừ DELETED
        Status deleted = statusRepository.findByEntityTypeAndCode("Product", "DELETED")
                .orElse(null);
        
        List<Product> products;
        if (deleted != null) {
            products = productRepository.findByStatusNot(deleted);
        } else {
            // Nếu không có status DELETED, lấy tất cả
            products = productRepository.findAll();
        }
        
        return products.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDto> getAllPaged(Pageable pageable) {
        // Lấy tất cả sản phẩm trừ DELETED với phân trang
        Status deleted = statusRepository.findByEntityTypeAndCode("Product", "DELETED")
                .orElse(null);
        
        Page<Product> products;
        if (deleted != null) {
            products = productRepository.findByStatusNot(deleted, pageable);
        } else {
            // Nếu không có status DELETED, lấy tất cả
            products = productRepository.findAll(pageable);
        }
        
        return products.map(this::toDto);
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

    @Override
    public Page<ProductDto> searchByNamePaged(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                .map(this::toDto);
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

        // === Product Units ===
        if (dto.getUnits() != null && !dto.getUnits().isEmpty()) {
            productUnitRepository.deleteByProduct_Id(saved.getId());
            
            // Ensure at least one base unit exists
            boolean hasBaseUnit = dto.getUnits().stream().anyMatch(u -> Boolean.TRUE.equals(u.getIsBaseUnit()));
            
            for (int i = 0; i < dto.getUnits().size(); i++) {
                ProductUnitDto unitDto = dto.getUnits().get(i);
                ProductUnit pu = new ProductUnit();
                pu.setProduct(saved);
                pu.setUnitName(unitDto.getUnitName());
                
                // Handle base unit logic
                boolean isBaseUnit = Boolean.TRUE.equals(unitDto.getIsBaseUnit()) || (!hasBaseUnit && i == 0);
                pu.setIsBaseUnit(isBaseUnit);
                
                // Base unit always has conversion rate = 1, others use provided rate
                if (isBaseUnit) {
                    pu.setConversionRate(BigDecimal.ONE);
                } else {
                    pu.setConversionRate(unitDto.getConversionRate() != null ? unitDto.getConversionRate() : BigDecimal.ONE);
                }
                
                pu.setCreatedDate(Instant.now());
                productUnitRepository.save(pu);
            }
        } else if (isCreate && (dto.getUnit() != null && !dto.getUnit().isBlank())) {
            // Create default base unit from the unit field for backward compatibility
            ProductUnit defaultUnit = new ProductUnit();
            defaultUnit.setProduct(saved);
            defaultUnit.setUnitName(dto.getUnit());
            defaultUnit.setConversionRate(BigDecimal.ONE);
            defaultUnit.setIsBaseUnit(true);
            defaultUnit.setCreatedDate(Instant.now());
            productUnitRepository.save(defaultUnit);
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
    public List<ProductUnitDto> getUnits(Integer productId) {
        return productUnitRepository.findByProduct_Id(productId)
                .stream()
                .map(pu -> ProductUnitDto.builder()
                        .id(pu.getId())
                        .productId(pu.getProduct().getId())
                        .unitName(pu.getUnitName())
                        .conversionRate(pu.getConversionRate())
                        .isBaseUnit(pu.getIsBaseUnit())
                        .createdDate(pu.getCreatedDate())
                        .build())
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

    // ==================== GET WITH STOCK ====================
    
    @Override
    public List<ProductDto> getAllWithStock(Integer warehouseId, Integer branchId) {
        // Lấy tất cả sản phẩm trừ DELETED
        Status deleted = statusRepository.findByEntityTypeAndCode("Product", "DELETED")
                .orElse(null);
        
        List<Product> products;
        if (deleted != null) {
            products = productRepository.findByStatusNot(deleted);
        } else {
            products = productRepository.findAll();
        }
        
        return products.stream()
                .map(product -> toDtoWithStock(product, warehouseId, branchId))
                .collect(Collectors.toList());
    }

    // ==================== DTO MAPPING ====================

    private ProductDto toDto(Product p) {
        List<ProductAttributeDto> attrs = productAttributeRepository.findByProduct_Id(p.getId())
                .stream()
                .map(a -> new ProductAttributeDto(a.getId(), a.getAttributeName(), a.getAttributeValue()))
                .collect(Collectors.toList());

        List<ProductUnitDto> units = productUnitRepository.findByProduct_Id(p.getId())
                .stream()
                .map(pu -> ProductUnitDto.builder()
                        .id(pu.getId())
                        .productId(pu.getProduct().getId())
                        .unitName(pu.getUnitName())
                        .conversionRate(pu.getConversionRate())
                        .isBaseUnit(pu.getIsBaseUnit())
                        .createdDate(pu.getCreatedDate())
                        .build())
                .collect(Collectors.toList());

        // If no units exist, create a default unit from the unit field for backward compatibility
        if (units.isEmpty() && p.getUnit() != null && !p.getUnit().isBlank()) {
            units.add(ProductUnitDto.builder()
                    .unitName(p.getUnit())
                    .conversionRate(BigDecimal.ONE)
                    .isBaseUnit(true)
                    .build());
        }

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
                .units(units)
                .build();
    }
    
    private ProductDto toDtoWithStock(Product p, Integer warehouseId, Integer branchId) {
        ProductDto dto = toDto(p); // Lấy thông tin cơ bản
        
        // Lấy thông tin tồn kho
        Optional<ProductInventory> inventory = Optional.empty();
        
        if (warehouseId != null && branchId != null) {
            inventory = productInventoryRepository.findByProduct_IdAndBranch_IdAndWarehouse_Id(
                p.getId(), branchId, warehouseId);
        } else if (branchId != null) {
            inventory = productInventoryRepository.findByProduct_IdAndBranch_Id(
                p.getId(), branchId);
        } else if (warehouseId != null) {
            // Tìm inventory theo warehouse (có thể có nhiều branch)
            List<ProductInventory> inventories = productInventoryRepository.findByProduct_Id(p.getId());
            inventory = inventories.stream()
                .filter(inv -> inv.getWarehouse() != null && inv.getWarehouse().getId().equals(warehouseId))
                .findFirst();
        }
        
        if (inventory.isPresent()) {
            ProductInventory inv = inventory.get();
            dto.setStock(inv.getOnHand() != null ? inv.getOnHand() : 0);
            dto.setAvailableStock(inv.getAvailable() != null ? inv.getAvailable() : 
                (inv.getOnHand() != null ? inv.getOnHand() : 0) - (inv.getReserved() != null ? inv.getReserved() : 0));
        } else {
            dto.setStock(0);
            dto.setAvailableStock(0);
        }
        
        return dto;
    }
}
