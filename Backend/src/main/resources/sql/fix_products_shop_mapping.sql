IF COL_LENGTH('products', 'shop_id') IS NULL
BEGIN
    ALTER TABLE products
    ADD shop_id INT NULL;
END;
GO

UPDATE products
SET shop_id = 1
WHERE shop_id IS NULL;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.default_constraints dc
    INNER JOIN sys.columns c ON c.default_object_id = dc.object_id
    INNER JOIN sys.tables t ON t.object_id = c.object_id
    WHERE t.name = 'products'
      AND c.name = 'shop_id'
)
BEGIN
    ALTER TABLE products
    ADD CONSTRAINT DF_products_shop_id DEFAULT 1 FOR shop_id;
END;
GO

IF EXISTS (
    SELECT 1
    FROM sys.columns c
    INNER JOIN sys.tables t ON t.object_id = c.object_id
    WHERE t.name = 'products'
      AND c.name = 'shop_id'
      AND c.is_nullable = 1
)
BEGIN
    ALTER TABLE products
    ALTER COLUMN shop_id INT NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_products_shop'
)
BEGIN
    ALTER TABLE products
    ADD CONSTRAINT FK_products_shop
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_products_shop_id'
      AND object_id = OBJECT_ID('products')
)
BEGIN
    CREATE INDEX IX_products_shop_id ON products(shop_id);
END;
GO

UPDATE products
SET stock = 0
WHERE stock IS NULL;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.default_constraints dc
    INNER JOIN sys.columns c ON c.default_object_id = dc.object_id
    INNER JOIN sys.tables t ON t.object_id = c.object_id
    WHERE t.name = 'products'
      AND c.name = 'stock'
)
BEGIN
    ALTER TABLE products
    ADD CONSTRAINT DF_products_stock DEFAULT 0 FOR stock;
END;
GO
