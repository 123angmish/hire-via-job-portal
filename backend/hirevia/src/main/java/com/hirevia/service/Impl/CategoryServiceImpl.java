package com.hirevia.service.Impl;

import com.hirevia.exceptions.InvalidDataException;
import com.hirevia.exceptions.NotFoundException;
import com.hirevia.models.Category;
import com.hirevia.repositories.CategoryRepository;
import com.hirevia.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category createCategory(Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new InvalidDataException("Category name is required!");
        }

        if (category.getDescription() == null || category.getDescription().trim().isEmpty()) {
            throw new InvalidDataException("Category description is required!");
        }

        if (category.getIconUrl() == null || category.getIconUrl().trim().isEmpty()) {
            throw new InvalidDataException("Category icon is required!");
        }

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long categoryId, Category category) {
        Category existingCategory = this.getCategoryById(categoryId);

        if (category.getName() != null && !category.getName().trim().isEmpty()) {
            existingCategory.setName(category.getName());
        }

        if (category.getDescription() != null && !category.getDescription().trim().isEmpty()) {
            existingCategory.setDescription(category.getDescription());
        }

        if (category.getOpenPositions() > 0) {
            existingCategory.setOpenPositions(category.getOpenPositions());
        }

        if (category.getIconUrl() != null && !category.getIconUrl().trim().isEmpty()) {
            existingCategory.setIconUrl(category.getIconUrl());
        }

        if (category.isActive() != existingCategory.isActive()) {
            existingCategory.setActive(category.isActive());
        }

        return categoryRepository.save(existingCategory);
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(() -> new NotFoundException("Category Not Found!"));
    }

    @Override
    public void deleteCategory(Long categoryId) {
        this.getCategoryById(categoryId);
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public List<Category> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) {
            List<String> defaultNames = List.of(
                "Information Technology",
                "Finance & Accounting",
                "Healthcare & Medical",
                "Education & Teaching",
                "Marketing & Sales",
                "Human Resources",
                "Design & Creative",
                "Customer Support"
            );
            for (String name : defaultNames) {
                Category cat = new Category();
                cat.setName(name);
                cat.setDescription(name + " Jobs");
                cat.setIconUrl("https://via.placeholder.com/150");
                cat.setActive(true);
                categoryRepository.save(cat);
            }
            return categoryRepository.findAll();
        }
        return categories;
    }

    @Override
    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    @Override
    public List<Category> searchCategories(String keyword) {
        return categoryRepository.findByNameContainingIgnoreCase(keyword);
    }
}
