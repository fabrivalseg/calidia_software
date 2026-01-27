package calidia.backend.repositorio;

import calidia.backend.modelo.Medicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicacionRepositorio extends JpaRepository<Medicacion, Long> {
    List<Medicacion> findByResidenteDni(String dni);
}
