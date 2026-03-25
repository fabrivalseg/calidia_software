package calidia.backend.repositorio;

import calidia.backend.modelo.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepositorio extends JpaRepository<PasswordResetToken, Long> {
    void deleteByEmail(String email);

    Optional<PasswordResetToken> findByTokenHashAndUsedFalseAndExpiresAtAfter(
            String tokenHash,
            LocalDateTime now
    );
}
