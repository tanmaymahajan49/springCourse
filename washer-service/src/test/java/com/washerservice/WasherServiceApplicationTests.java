package com.washerservice;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import com.washerservice.service.WasherService;
// import com.washerservice.model.Washer;

@SpringBootTest
class WasherServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void testAddWasherWithNullData_shouldFail() {
		// Edge/Negative: Null washer data
		// Assertions.assertThrows(IllegalArgumentException.class, () -> washerService.addWasher(null));
	}

	@Test
	void testAddWasherWithEmptyFields_shouldFail() {
		// Edge/Negative: Empty washer fields
		// Washer washer = new Washer();
		// Assertions.assertThrows(ValidationException.class, () -> washerService.addWasher(washer));
	}

	@Test
	void testAddWasherWithBoundaryValues() {
		// Edge: Test with boundary values (e.g., min/max name length)
		// Washer washer = new Washer();
		// washer.setName(""); // Too short
		// Assertions.assertThrows(ValidationException.class, () -> washerService.addWasher(washer));
	}

	@Test
	void testDeleteWasherWithInvalidId_shouldFail() {
		// Negative: Invalid washer ID
		// Assertions.assertThrows(WasherNotFoundException.class, () -> washerService.deleteWasher(-1L));
	}
}
