package com.hirevia.repositories;

import com.hirevia.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);
    List<Category> findByNameContainingIgnoreCase(String keyword);
}
