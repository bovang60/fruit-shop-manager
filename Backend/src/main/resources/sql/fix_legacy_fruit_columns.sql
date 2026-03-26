/* 
   Legacy compatibility fix:
   - Keep product_id as canonical FK for cart/order items
   - Relax legacy fruit_id constraints so it no longer blocks inserts
*/

DECLARE @sql NVARCHAR(MAX) = N'';

SELECT @sql = @sql +
    'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) +
    ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(10)
FROM sys.foreign_keys
WHERE parent_object_id IN (OBJECT_ID('cart_items'), OBJECT_ID('order_items'))
  AND referenced_object_id = OBJECT_ID('fruits');

IF (@sql <> N'')
    EXEC sp_executesql @sql;
GO

IF COL_LENGTH('cart_items', 'fruit_id') IS NOT NULL
BEGIN
    ALTER TABLE cart_items ALTER COLUMN fruit_id INT NULL;
END;
GO

IF COL_LENGTH('order_items', 'fruit_id') IS NOT NULL
BEGIN
    ALTER TABLE order_items ALTER COLUMN fruit_id INT NULL;
END;
GO
