package com.fruitshop.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE order_items DROP CONSTRAINT FK_order_items_fruit");
            System.out.println("Drop constraint FK_order_items_fruit SUCCESS");
        } catch (Exception e) {
            System.out.println("Constraint FK_order_items_fruit might not exist or already dropped.");
        }
        
        try {
            jdbcTemplate.execute("ALTER TABLE order_items DROP COLUMN fruit_id");
            System.out.println("Drop column fruit_id SUCCESS");
        } catch (Exception e) {
            System.out.println("Column fruit_id might not exist or already dropped.");
        }

        try {
            String sql = "DECLARE @ConstraintName nvarchar(200)\n" +
                         "SELECT @ConstraintName = Name FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID('transactions') AND parent_column_id = COLUMNPROPERTY(OBJECT_ID('transactions'), 'payment_status', 'ColumnId')\n" +
                         "IF @ConstraintName IS NOT NULL BEGIN EXEC('ALTER TABLE transactions DROP CONSTRAINT ' + @ConstraintName) END";
            jdbcTemplate.execute(sql);
            System.out.println("Drop constraints on transactions.payment_status SUCCESS");
        } catch (Exception e) {
            System.out.println("Constraint on transactions.payment_status might not exist or already dropped: " + e.getMessage());
        }

        try {
            jdbcTemplate.update("UPDATE transactions SET payment_status = 'UNPAID' WHERE payment_status = 'PENDING'");
            jdbcTemplate.update("UPDATE transactions SET payment_status = 'PAID' WHERE payment_status = 'SUCCESS'");
            System.out.println("Migrated old PENDING/SUCCESS transactions to UNPAID/PAID SUCCESS");
        } catch (Exception e) {
            System.out.println("Failed to migrate old transaction payment statuses: " + e.getMessage());
        }
    }
}
