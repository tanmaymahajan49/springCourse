package com.adminservice;

import com.adminservice.client.WasherClient;
import com.adminservice.entity.Admin;
import com.adminservice.model.Booking;
import com.adminservice.model.Washer;
import com.adminservice.repository.AdminRepository;
import com.adminservice.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyLong;
import static org.mockito.Mockito.doThrow;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
public class AdminServiceApplicationTests {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private WasherClient washerClient;

    @InjectMocks
    private AdminService adminService;

    private Admin admin;

    @BeforeEach
    void setUp() {
        admin = new Admin();
        admin.setId(1L);
        admin.setName("Test Admin");
    }

    @Test
    void testGetAllAdmins() {
        Admin admin1 = new Admin();
        admin1.setId(1L);
        admin1.setName("Admin One");

        Admin admin2 = new Admin();
        admin2.setId(2L);
        admin2.setName("Admin Two");

        List<Admin> adminList = Arrays.asList(admin1, admin2);

        when(adminRepository.findAll()).thenReturn(adminList);

        List<Admin> admins = adminService.getAllAdmins();

        assertNotNull(admins);
        assertEquals(2, admins.size());
        assertEquals("Admin One", admins.get(0).getName());
        assertEquals("Admin Two", admins.get(1).getName());
    }

    @Test
    void testAddAdmin() {
        when(adminRepository.save(admin)).thenReturn(admin);

        Admin savedAdmin = adminService.addAdmin(admin);

        assertNotNull(savedAdmin);
        assertEquals("Test Admin", savedAdmin.getName());
    }

    @Test
    void testGetAllBookingsWithWasherDetails() {
        Booking booking = new Booking();
        booking.setWasherId(1L);

        Washer washer = new Washer();
        washer.setId(1L);
        washer.setName("Washer One");
        washer.setContactInfo("123456789");

        when(washerClient.getWasherById(1L)).thenReturn(washer);

        AdminService partialMock = org.mockito.Mockito.spy(adminService);
        when(partialMock.getAllBookings()).thenReturn(Arrays.asList(booking));

        List<Booking> bookings = partialMock.getAllBookingsWithWasherDetails();

        assertNotNull(bookings);
        assertEquals(1, bookings.size());
        assertEquals("Washer One", bookings.get(0).getWasherName());
        assertEquals("123456789", bookings.get(0).getWasherContact());
    }

    // EDGE & NEGATIVE TESTS
    @Test
    void testAddAdminWithNull_shouldFail() {
        // Edge/Negative: Null admin data
        assertThrows(IllegalArgumentException.class, () -> adminService.addAdmin(null));
    }

    @Test
    void testAddAdminWithEmptyName_shouldFail() {
        // Edge/Negative: Empty admin name
        Admin emptyAdmin = new Admin();
        emptyAdmin.setName("");
        assertThrows(IllegalArgumentException.class, () -> adminService.addAdmin(emptyAdmin));
    }

    @Test
    void testGetAdminByIdNotFound_shouldFail() {
        // Negative: Non-existent admin ID
        when(adminRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> adminService.getAdminById(999L));
    }

    @Test
    void testDeleteAdminByIdNotFound_shouldFail() {
        // Negative: Non-existent admin ID for delete
        doThrow(new RuntimeException("Admin not found")).when(adminRepository).deleteById(anyLong());
        assertThrows(RuntimeException.class, () -> adminService.deleteAdmin(999L));
    }

    @Test
    void testGetAllBookingsWithInvalidWasher_shouldHandleGracefully() {
        // Edge/Negative: Washer not found for booking
        Booking booking = new Booking();
        booking.setWasherId(999L);
        when(washerClient.getWasherById(999L)).thenReturn(null);
        AdminService partialMock = org.mockito.Mockito.spy(adminService);
        when(partialMock.getAllBookings()).thenReturn(Arrays.asList(booking));
        List<Booking> bookings = partialMock.getAllBookingsWithWasherDetails();
        assertNotNull(bookings);
        assertNull(bookings.get(0).getWasherName());
    }
}
