-- ============================================================
-- Migration: Tách Cart theo Shop (Cart-per-Shop Architecture)
-- Database: SQL Server
-- Date: 2026-04-05
-- ============================================================
-- 
-- THAY ĐỔI SCHEMA:
--   Bảng CARTS:
--     - BỎ cột: product_id, quantity, sheller_id (seller)
--     - THÊM cột: shop_id (FK → shops)
--     - BỎ status constants cũ (0,1,2,-1), chỉ giữ -2 (IN_CART)
--     - BỎ index cũ, thêm index mới
--
--   Bảng CART_ITEMS: không đổi schema (đã có cart_id, product_id, quantity)
--
-- ============================================================

-- BƯỚC 1: Xóa dữ liệu cũ (Cart cũ không tương thích schema mới)
DELETE FROM cart_items;
DELETE FROM carts;

-- BƯỚC 2: Xóa FK constraints cũ trên bảng carts
-- (tên constraint có thể khác, check DB của bạn)
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FKb5o626f86h46m4s7ms6ginnop')
    ALTER TABLE carts DROP CONSTRAINT FKb5o626f86h46m4s7ms6ginnop;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_cart_items_cart')
    ALTER TABLE cart_items DROP CONSTRAINT FK_cart_items_cart;

-- BƯỚC 3: Xóa index cũ
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_cart_customer_status' AND object_id = OBJECT_ID('carts'))
    DROP INDEX idx_cart_customer_status ON carts;

IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_cart_customer_product_status' AND object_id = OBJECT_ID('carts'))
    DROP INDEX idx_cart_customer_product_status ON carts;

IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_cart_seller_status' AND object_id = OBJECT_ID('carts'))
    DROP INDEX idx_cart_seller_status ON carts;

-- BƯỚC 4: Xóa cột cũ
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('carts') AND name = 'product_id')
    ALTER TABLE carts DROP COLUMN product_id;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('carts') AND name = 'quantity')
    ALTER TABLE carts DROP COLUMN quantity;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('carts') AND name = 'sheller_id')
    ALTER TABLE carts DROP COLUMN sheller_id;

-- BƯỚC 5: Thêm cột mới shop_id (nếu chưa tồn tại)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('carts') AND name = 'shop_id')
    ALTER TABLE carts ADD shop_id INT NOT NULL;

-- BƯỚC 6: Thêm FK constraint mới
ALTER TABLE carts ADD CONSTRAINT FK_carts_shop 
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id);

-- BƯỚC 7: Tạo index mới
CREATE INDEX idx_cart_customer_status ON carts(customer_id, status);
CREATE INDEX idx_cart_customer_shop_status ON carts(customer_id, shop_id, status);

-- BƯỚC 8: Recreate FK cho cart_items (nếu cần)
ALTER TABLE cart_items ADD CONSTRAINT FK_cart_items_cart 
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id);

-- BƯỚC 9: Thêm UNIQUE constraint (1 user chỉ có 1 cart / 1 shop / 1 status)
-- Đảm bảo không tạo duplicate cart cho cùng customer + shop
IF NOT EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'uk_cart_customer_shop_status')
    ALTER TABLE carts ADD CONSTRAINT uk_cart_customer_shop_status 
        UNIQUE (customer_id, shop_id, status);

-- ============================================================
-- XONG! Hibernate ddl-auto=update sẽ xử lý phần còn lại
-- ============================================================
