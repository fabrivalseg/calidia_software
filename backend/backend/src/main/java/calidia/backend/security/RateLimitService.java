package calidia.backend.security;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(10);
    private static final Duration BLOCK_DURATION = Duration.ofMinutes(15);

    private final Map<String, AttemptInfo> attemptsByKey = new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        AttemptInfo info = attemptsByKey.get(key);
        if (info == null) {
            return false;
        }

        Instant now = Instant.now();
        if (info.blockedUntil != null && now.isBefore(info.blockedUntil)) {
            return true;
        }

        if (info.blockedUntil != null && now.isAfter(info.blockedUntil)) {
            attemptsByKey.remove(key);
            return false;
        }

        return false;
    }

    public long retryAfterSeconds(String key) {
        AttemptInfo info = attemptsByKey.get(key);
        if (info == null || info.blockedUntil == null) {
            return 0;
        }

        long seconds = Duration.between(Instant.now(), info.blockedUntil).getSeconds();
        return Math.max(seconds, 0);
    }

    public void registerFailure(String key) {
        Instant now = Instant.now();
        attemptsByKey.compute(key, (k, info) -> {
            if (info == null || now.isAfter(info.windowStart.plus(WINDOW))) {
                info = new AttemptInfo();
                info.windowStart = now;
                info.failures = 0;
            }

            info.failures++;
            if (info.failures >= MAX_ATTEMPTS) {
                info.blockedUntil = now.plus(BLOCK_DURATION);
            }

            return info;
        });
    }

    public void registerSuccess(String key) {
        attemptsByKey.remove(key);
    }

    private static class AttemptInfo {
        private int failures;
        private Instant windowStart;
        private Instant blockedUntil;
    }
}
