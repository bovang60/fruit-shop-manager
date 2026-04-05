package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.OrderVoucher;
import com.fruitshop.backend.model.OrderVoucherId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderVoucherRepository extends JpaRepository<OrderVoucher, OrderVoucherId> {
}
