package com.hirevia.config;

import com.hirevia.models.Category;
import com.hirevia.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(1)
public class DatabaseMigrationRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        String[] alterStatements = {
                "ALTER TABLE IF EXISTS job_responsibilities ALTER COLUMN responsibilities VARCHAR(10000)",
                "ALTER TABLE IF EXISTS job_required_skills ALTER COLUMN required_skills VARCHAR(10000)",
                "ALTER TABLE IF EXISTS user_skills ALTER COLUMN skills VARCHAR(10000)",
                "ALTER TABLE IF EXISTS jobs ALTER COLUMN description VARCHAR(50000)",
                "ALTER TABLE IF EXISTS companies ALTER COLUMN description VARCHAR(50000)",
                "ALTER TABLE IF EXISTS applications ALTER COLUMN cover_letter VARCHAR(50000)",
                "ALTER TABLE IF EXISTS applications ALTER COLUMN resume_url VARCHAR(10000)",
                "ALTER TABLE IF EXISTS users ALTER COLUMN bio VARCHAR(50000)",
                "ALTER TABLE IF EXISTS users ALTER COLUMN profile_picture VARCHAR(500000)",
                "ALTER TABLE IF EXISTS users ALTER COLUMN resume VARCHAR(50000)"
        };

        for (String sql : alterStatements) {
            try {
                jdbcTemplate.execute(sql);
            } catch (Exception e) {
                // Ignore if table/column format is already adjusted
            }
        }

        // Initialize standard professional job categories if none exist
        if (categoryRepository.count() == 0) {
            List<Category> standardCategories = List.of(
                    createCategory("Technology & Engineering", "Software development, cloud architecture, and systems engineering roles", "https://img.icons8.com/fluency/96/code.png"),
                    createCategory("Product & Project Management", "Product leadership, scrum master, and technical program management", "https://img.icons8.com/fluency/96/project-management.png"),
                    createCategory("Design & Creative", "UI/UX design, design systems, visual branding, and motion graphics", "https://img.icons8.com/fluency/96/design.png"),
                    createCategory("Data Science & AI", "Machine learning, AI research, data analytics, and business intelligence", "https://img.icons8.com/fluency/96/artificial-intelligence.png"),
                    createCategory("Sales & Marketing", "Growth marketing, corporate sales, account management, and SEO", "https://img.icons8.com/fluency/96/bullish.png"),
                    createCategory("Finance & Accounting", "Financial planning, auditing, investment banking, and fintech operations", "https://img.icons8.com/fluency/96/banknotes.png"),
                    createCategory("HR & Operations", "Talent acquisition, employee experience, payroll, and business operations", "https://img.icons8.com/fluency/96/conference.png"),
                    createCategory("Customer Success & Support", "Client relationship management, technical support, and onboarding", "https://img.icons8.com/fluency/96/customer-support.png")
            );
            categoryRepository.saveAll(standardCategories);
        }
    }

    private Category createCategory(String name, String description, String iconUrl) {
        Category cat = new Category();
        cat.setName(name);
        cat.setDescription(description);
        cat.setIconUrl(iconUrl);
        cat.setActive(true);
        cat.setOpenPositions(0);
        return cat;
    }
}
