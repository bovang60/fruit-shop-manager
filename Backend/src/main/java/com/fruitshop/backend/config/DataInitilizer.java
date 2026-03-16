package com.fruitshop.backend.config;

import com.fruitshop.backend.dto.CategoryDto;
import com.fruitshop.backend.model.Category;
import com.fruitshop.backend.repository.CategoryRepository;
import com.fruitshop.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


public class DataInitilizer implements CommandLineRunner {
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0) {
            return;
        }

        CategoryDto c1 = new CategoryDto();
        c1.setCategoryName("Tropical Fruits");
        c1.setDescription("Fruits grown in tropical regions such as mango, pineapple, and banana");
        c1.setStatus(Category.CategoryStatus.ACTIVE);

        CategoryDto c2 = new CategoryDto();
        c2.setCategoryName("Imported Fruits");
        c2.setDescription("Fresh fruits imported from other countries like apple, cherry, and kiwi");
        c2.setStatus(Category.CategoryStatus.ACTIVE);

        CategoryDto c3 = new CategoryDto();
        c3.setCategoryName("Organic Fruits");
        c3.setDescription("Organic fruits grown without chemical fertilizers or pesticides");
        c3.setStatus(Category.CategoryStatus.ACTIVE);

        CategoryDto c4 = new CategoryDto();
        c4.setCategoryName("Fruit Juice");
        c4.setDescription("Fresh juice made from natural fruits");
        c4.setStatus(Category.CategoryStatus.ACTIVE);

        categoryService.createCategory(c1);
        categoryService.createCategory(c2);
        categoryService.createCategory(c3);
        categoryService.createCategory(c4);
    }
}
