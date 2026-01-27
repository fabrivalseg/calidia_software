package calidia.backend.repositorio;

import calidia.backend.modelo.Evolucion;
import calidia.backend.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
    boolean existsByEmail(String email);
    boolean deleteByEmail(String email);
}
