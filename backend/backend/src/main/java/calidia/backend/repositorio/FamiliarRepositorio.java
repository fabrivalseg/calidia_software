package calidia.backend.repositorio;

import calidia.backend.modelo.Familiar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FamiliarRepositorio extends JpaRepository<Familiar, Long> {
}
