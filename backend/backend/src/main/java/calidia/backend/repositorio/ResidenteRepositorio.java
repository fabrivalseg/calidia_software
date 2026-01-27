package calidia.backend.repositorio;

import calidia.backend.modelo.Residente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResidenteRepositorio extends JpaRepository<Residente, String> {
    boolean existsByDni(String dni);
    Residente findByDni(String dni);
}
