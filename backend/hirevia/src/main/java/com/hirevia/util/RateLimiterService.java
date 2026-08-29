package com.hirevia.util;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimiterService {

    private static final int MAX_ATTEMPTS_PER_WINDOW = 15;
    private static final long WINDOW_DURATION_MS = 60 * 1000; // 1 minute

    private final ConcurrentHashMap<String, AttemptTracker> attempts = new ConcurrentHashMap<>();

    public boolean isAllowed(String key) {
        long now = System.currentTimeMillis();
        AttemptTracker tracker = attempts.compute(key, (k, existing) -> {
            if (existing == null || (now - existing.timestamp > WINDOW_DURATION_MS)) {
                return new AttemptTracker(new AtomicInteger(1), now);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        return tracker.count.get() <= MAX_ATTEMPTS_PER_WINDOW;
    }

    public void reset(String key) {
        attempts.remove(key);
    }

    private static class AttemptTracker {
        final AtomicInteger count;
        final long timestamp;

        AttemptTracker(AtomicInteger count, long timestamp) {
            this.count = count;
            this.timestamp = timestamp;
        }
    }
}
