package com.itransform.customerservice;

import com.itransform.customerservice.dto.CustomerDTO;
import com.itransform.customerservice.entity.Customer;
import com.itransform.customerservice.exception.CustomerNotFoundException;
import com.itransform.customerservice.repository.CustomerRepository;
import com.itransform.customerservice.service.CustomerServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceApplicationTests {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private CustomerDTO customerDTO;
    private Customer customer;

    @BeforeEach
    void setUp() {
        // Initialize test data
        customerDTO = new CustomerDTO(
                "John Doe",
                "john.doe@example.com",
                "password123",
                "1234567890",
                "123 Main St"
        );

        customer = new Customer(
                1L,
                "John Doe",
                "john.doe@example.com",
                "password123",
                "1234567890",
                "123 Main St"
        );
    }

    @Test
    @DisplayName("Should register customer successfully")
    void testRegisterCustomer_Success() {
        // Given
        when(customerRepository.existsByEmail(anyString())).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        // When
        String result = customerService.registerCustomer(customerDTO);

        // Then
        assertNotNull(result);
        assertEquals("Customer registered successfully!", result);
        verify(customerRepository, times(1)).existsByEmail(customerDTO.getEmail());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should throw exception when registering with existing email")
    void testRegisterCustomer_EmailExists() {
        // Given
        when(customerRepository.existsByEmail(anyString())).thenReturn(true);

        // When & Then
        Exception exception = assertThrows(RuntimeException.class, () -> {
            customerService.registerCustomer(customerDTO);
        });
        
        assertEquals("Email already registered", exception.getMessage());
        verify(customerRepository, times(1)).existsByEmail(customerDTO.getEmail());
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should return customer by ID successfully")
    void testGetCustomerById_Success() {
        // Given
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));

        // When
        Customer result = customerService.getCustomerById(1L);

        // Then
        assertNotNull(result);
        assertEquals(customer.getId(), result.getId());
        assertEquals(customer.getFullName(), result.getFullName());
        assertEquals(customer.getEmail(), result.getEmail());
        verify(customerRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when customer ID not found")
    void testGetCustomerById_NotFound() {
        // Given
        when(customerRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        Exception exception = assertThrows(CustomerNotFoundException.class, () -> {
            customerService.getCustomerById(1L);
        });
        
        assertEquals("Customer not found with id 1", exception.getMessage());
        verify(customerRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should update customer successfully")
    void testUpdateCustomer_Success() {
        // Given
        CustomerDTO updateDTO = new CustomerDTO(
                "John Updated",
                "john.updated@example.com",
                "newpassword",
                "9876543210",
                "456 New St"
        );
        
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        // When
        String result = customerService.updateCustomer(1L, updateDTO);

        // Then
        assertNotNull(result);
        assertEquals("Customer updated successfully!", result);
        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, times(1)).save(any(Customer.class));
        
        // Verify that the customer was updated with new values
        assertEquals(updateDTO.getFullName(), customer.getFullName());
        assertEquals(updateDTO.getEmail(), customer.getEmail());
        assertEquals(updateDTO.getPassword(), customer.getPassword());
        assertEquals(updateDTO.getPhone(), customer.getPhone());
        assertEquals(updateDTO.getAddress(), customer.getAddress());
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent customer")
    void testUpdateCustomer_NotFound() {
        // Given
        when(customerRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        Exception exception = assertThrows(CustomerNotFoundException.class, () -> {
            customerService.updateCustomer(1L, customerDTO);
        });
        
        assertEquals("Customer not found with id 1", exception.getMessage());
        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should delete customer successfully")
    void testDeleteCustomer_Success() {
        // Given
        when(customerRepository.existsById(anyLong())).thenReturn(true);
        doNothing().when(customerRepository).deleteById(anyLong());

        // When
        String result = customerService.deleteCustomer(1L);

        // Then
        assertNotNull(result);
        assertEquals("Customer deleted successfully!", result);
        verify(customerRepository, times(1)).existsById(1L);
        verify(customerRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent customer")
    void testDeleteCustomer_NotFound() {
        // Given
        when(customerRepository.existsById(anyLong())).thenReturn(false);

        // When & Then
        Exception exception = assertThrows(CustomerNotFoundException.class, () -> {
            customerService.deleteCustomer(1L);
        });
        
        assertEquals("Customer not found with id 1", exception.getMessage());
        verify(customerRepository, times(1)).existsById(1L);
        verify(customerRepository, never()).deleteById(anyLong());
    }
}