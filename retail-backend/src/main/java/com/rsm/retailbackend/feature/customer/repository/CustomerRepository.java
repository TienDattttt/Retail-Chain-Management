package com.rsm.retailbackend.feature.customer.repository;

import com.rsm.retailbackend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // Dành cho admin (role 1) - lấy tất cả hoặc lọc theo BranchId
    @Query("SELECT c FROM Customer c WHERE (:branchId IS NULL OR c.branch.id = :branchId)")
    List<Customer> findAllByBranchId(Integer branchId);

    // Dành cho manager (role 2)
    List<Customer> findByBranch_Id(Integer branchId);

    // Dành cho tìm kiếm chung (role 1,2,3)
    Optional<Customer> findByContactNumber(String contactNumber);
}
