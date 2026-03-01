package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ShopDto;
import com.fruitshop.backend.dto.ShopRejectDto;
import com.fruitshop.backend.model.Shop;
import com.fruitshop.backend.model.User;
import com.fruitshop.backend.repository.ShopRepository;
import com.fruitshop.backend.repository.UserRepository;
import com.fruitshop.backend.service.impl.ShopServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ShopHandlerTest {

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ShopServiceImpl shopService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Status=rejected, Feedback="Need to business licences" -> Success
    @Test
    void testRejectShop_Success() {
        Integer id = 1;
        ShopRejectDto rejectDto = new ShopRejectDto();
        rejectDto.setReason("Need to business licences");

        Shop shop = new Shop();
        shop.setShopId(id);
        shop.setStatus(Shop.ShopStatus.PENDING);

        when(shopRepository.findById(id)).thenReturn(Optional.of(shop));
        when(shopRepository.save(any(Shop.class))).thenAnswer(i -> i.getArguments()[0]);

        ShopDto result = shopService.rejectShop(id, rejectDto);

        assertNotNull(result);
        assertEquals(Shop.ShopStatus.REJECTED, result.getStatus());
        assertEquals("Need to business licences", result.getRejectReason());
        verify(shopRepository, times(1)).save(any(Shop.class));
    }

    // Status=rejected, Feedback=null -> "Phản hồi chi tiết là null"
    @Test
    void testRejectShop_FeedbackNull() {

        Integer id = 1;
        ShopRejectDto rejectDto = new ShopRejectDto();
        rejectDto.setReason(null);

        Shop shop = new Shop();
        shop.setShopId(id);

        when(shopRepository.findById(id)).thenReturn(Optional.of(shop));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            shopService.rejectShop(id, rejectDto);
        });

        assertEquals("Phản hồi chi tiết là null", exception.getMessage());
        verify(shopRepository, never()).save(any());
    }
    // Status=rejected, Feedback > 255 chars -> "Phản hồi chi tiết nhiều hơn 255 ký tự"
    @Test
    void testRejectShop_FeedbackTooLong() {

        Integer id = 1;
        ShopRejectDto rejectDto = new ShopRejectDto();
        StringBuilder longReason = new StringBuilder();
        for (int i = 0; i < 256; i++) {
            longReason.append("a");
        }
        rejectDto.setReason(longReason.toString());

        Shop shop = new Shop();
        shop.setShopId(id);

        when(shopRepository.findById(id)).thenReturn(Optional.of(shop));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            shopService.rejectShop(id, rejectDto);
        });

        assertEquals("Phản hồi chi tiết nhiều hơn 255 ký tự", exception.getMessage());
        verify(shopRepository, never()).save(any());
    }

    // Status=approved -> Success
    @Test
    void testApproveShop_Success() {

        Integer id = 1;
        Shop shop = new Shop();
        shop.setShopId(id);
        shop.setStatus(Shop.ShopStatus.PENDING);

        when(shopRepository.findById(id)).thenReturn(Optional.of(shop));
        when(shopRepository.save(any(Shop.class))).thenAnswer(i -> i.getArguments()[0]);

        ShopDto result = shopService.approveShop(id);

        assertNotNull(result);
        assertEquals(Shop.ShopStatus.APPROVED, result.getStatus());
        verify(shopRepository, times(1)).save(any(Shop.class));
    }

    // Shop not exist -> "Đơn xin không còn tồn tại"
    @Test
    void testApproveShop_NotFound() {

        Integer id = 999;
        when(shopRepository.findById(id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            shopService.approveShop(id);
        });

        assertEquals("Đơn xin không còn tồn tại", exception.getMessage());
        verify(shopRepository, never()).save(any());
    }
    // Status=suspended -> Success
    @Test
    void testSuspendShop_Success() {

        Integer id = 1;
        Shop shop = new Shop();
        shop.setShopId(id);
        shop.setStatus(Shop.ShopStatus.APPROVED);

        when(shopRepository.findById(id)).thenReturn(Optional.of(shop));
        when(shopRepository.save(any(Shop.class))).thenAnswer(i -> i.getArguments()[0]);

        ShopDto result = shopService.suspendShop(id);

        assertNotNull(result);
        assertEquals(Shop.ShopStatus.SUSPENDED, result.getStatus());
        verify(shopRepository, times(1)).save(any(Shop.class));
    }
}
