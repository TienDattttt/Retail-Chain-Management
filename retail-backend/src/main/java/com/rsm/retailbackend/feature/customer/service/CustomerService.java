package com.rsm.retailbackend.feature.customer.service;

import com.rsm.retailbackend.entity.Customer;

import java.util.List;

public interface CustomerService {
    List<Customer> getAllActiveCustomers();
    Customer getCustomerById(Integer id);
    Customer createCustomer(Customer customer);
}