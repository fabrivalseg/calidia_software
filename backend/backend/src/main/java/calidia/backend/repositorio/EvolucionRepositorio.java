package calidia.backend.repositorio;

import calidia.backend.modelo.Evolucion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;


public interface EvolucionRepositorio extends JpaRepository<Evolucion, Long> {
    Page<Evolucion> findByResidenteDniOrderByFechaDescHoraDesc(String dni, Pageable pageable);

    @Query(
            "SELECT e " +
                    "FROM Evolucion e " +
                    "WHERE e.residente.dni = :dni " +
                    "AND e.fecha BETWEEN :fechaInicio AND :fechaFin " +
                    "AND (:turno IS NULL OR e.turno = :turno) " +
                    "ORDER BY e.fecha DESC, e.hora DESC"
    )
    Page<Evolucion> filtrarHistorial(
            @Param("dni") String dni,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("turno") String turno,
            Pageable pageable
    );
}
