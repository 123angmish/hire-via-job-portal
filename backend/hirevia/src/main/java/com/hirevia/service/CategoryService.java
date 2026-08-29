package com.hirevia.service;

import com.hirevia.models.Category;

import java.util.List;

public interface CategoryService {
    Category createCategory(Category category);

    Category updateCategory(Long categoryId, Category category);

    Category getCategoryById(Long categoryId);

    void deleteCategory(Long categoryId);

    List<Category> getAllCategories();

    Category getCategoryByName(String name);

    List<Category> searchCategories(String keyword);
}
