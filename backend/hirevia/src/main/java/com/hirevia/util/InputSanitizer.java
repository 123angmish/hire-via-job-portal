package com.hirevia.util;

import java.util.regex.Pattern;

public class InputSanitizer {

    private static final Pattern SCRIPT_PATTERN = Pattern.compile(
            "<script>(.*?)</script>|javascript:|onload=|onclick=|onerror=|<iframe(.*?)</iframe>",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );

    private static final Pattern HTML_TAGS_PATTERN = Pattern.compile("<[^>]*>");

    public static String sanitize(String input) {
        if (input == null) return null;
        String sanitized = input.trim();
        sanitized = SCRIPT_PATTERN.matcher(sanitized).replaceAll("");
        return sanitized;
    }

    public static String stripHtml(String input) {
        if (input == null) return null;
        String sanitized = sanitize(input);
        return HTML_TAGS_PATTERN.matcher(sanitized).replaceAll("").trim();
    }

    public static String normalizeEmail(String email) {
        if (email == null) return null;
        return email.trim().toLowerCase();
    }

    public static String normalizePhone(String phone) {
        if (phone == null) return null;
        return phone.replaceAll("[^0-9+]", "").trim();
    }
}
