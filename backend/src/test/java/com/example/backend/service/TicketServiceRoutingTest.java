package com.example.backend.service;

import com.example.backend.dto.request.TicketRequest;
import com.example.backend.dto.response.TicketResponse;
import com.example.backend.model.Department;
import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import com.example.backend.model.enums.TicketCategory;
import com.example.backend.model.enums.TicketPriority;
import com.example.backend.model.enums.UserRole;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.TicketRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceRoutingTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    private final User student = user(100L, "student@example.com", UserRole.STUDENT);
    @BeforeEach
    void setUp() {
        List<Department> departments = List.of(
                department(1L, "IT Department"),
                department(2L, "Network Department"),
                department(3L, "Hardware Support"),
                department(4L, "Hostel Department"),
                department(5L, "Fees Department"),
                department(6L, "Facilities Department"));
        when(departmentRepository.findAll()).thenReturn(departments);
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(student));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void routesEachSupportedCategoryToStaffInItsDepartment() {
        TicketService service = new TicketService(ticketRepository, userRepository, departmentRepository);
        long userId = 1L;

        for (TicketCategory category : List.of(
                TicketCategory.IT,
                TicketCategory.NETWORK,
                TicketCategory.HARDWARE,
                TicketCategory.HOSTEL,
                TicketCategory.FEES,
                TicketCategory.FACILITIES)) {
            User staff = user(userId++, category.name().toLowerCase() + "@example.com", UserRole.STAFF);
            Department department = departmentFor(category);
            userIdForDepartment(staff, department);
            when(userRepository.findByDepartmentIdAndRoleAndActiveTrue(
                    eq(department.getId()), eq(UserRole.STAFF))).thenReturn(List.of(staff));
            when(ticketRepository.countByAssignedToIdAndStatusIn(eq(staff.getId()), any())).thenReturn(0L);

            TicketResponse response = service.createTicket(request(category), "student@example.com");

            assertEquals(staff.getId(), response.getAssignedTo().getId(), category.name());
            assertEquals(department.getName(), response.getAssignedDepartment().getName(), category.name());
        }
    }

    @Test
    void choosesLowestActiveLoadThenLowestUserIdWithinDepartment() {
        TicketService service = new TicketService(ticketRepository, userRepository, departmentRepository);
        Department it = department(1L, "IT Department");
        User higherId = user(20L, "higher@example.com", UserRole.STAFF);
        User lowerId = user(10L, "lower@example.com", UserRole.STAFF);
        userIdForDepartment(higherId, it);
        userIdForDepartment(lowerId, it);
        when(userRepository.findByDepartmentIdAndRoleAndActiveTrue(1L, UserRole.STAFF))
                .thenReturn(List.of(higherId, lowerId));
        when(ticketRepository.countByAssignedToIdAndStatusIn(eq(20L), any())).thenReturn(4L);
        when(ticketRepository.countByAssignedToIdAndStatusIn(eq(10L), any())).thenReturn(4L);

        TicketResponse response = service.createTicket(request(TicketCategory.IT), "student@example.com");

        assertEquals(10L, response.getAssignedTo().getId());
    }

    @Test
    void leavesTicketUnassignedWhenDepartmentHasNoActiveStaff() {
        TicketService service = new TicketService(ticketRepository, userRepository, departmentRepository);
        when(userRepository.findByDepartmentIdAndRoleAndActiveTrue(1L, UserRole.STAFF))
                .thenReturn(List.of());

        TicketResponse response = service.createTicket(request(TicketCategory.IT), "student@example.com");

        assertNull(response.getAssignedTo());
        assertNull(response.getAssignedDepartment());
    }

    private TicketRequest request(TicketCategory category) {
        TicketRequest request = new TicketRequest();
        request.setTitle("Routing test");
        request.setDescription("Routing test");
        request.setPriority(TicketPriority.MEDIUM);
        request.setCategory(category);
        return request;
    }

    private static Department departmentFor(TicketCategory category) {
        return switch (category) {
            case IT -> department(1L, "IT Department");
            case NETWORK -> department(2L, "Network Department");
            case HARDWARE -> department(3L, "Hardware Support");
            case HOSTEL -> department(4L, "Hostel Department");
            case FEES -> department(5L, "Fees Department");
            case FACILITIES -> department(6L, "Facilities Department");
            default -> throw new IllegalArgumentException("Unsupported routing test category: " + category);
        };
    }

    private static User user(Long id, String email, UserRole role) {
        User user = new User("User " + id, email, "password", role);
        user.setId(id);
        return user;
    }

    private static Department department(Long id, String name) {
        Department department = new Department(name, "", true);
        setField(department, "id", id);
        return department;
    }

    private static void userIdForDepartment(User user, Department department) {
        user.setDepartment(department);
    }

    private static void setField(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (ReflectiveOperationException exception) {
            throw new IllegalStateException(exception);
        }
    }
}
