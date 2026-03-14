package calidia.backend.controlador;

import calidia.backend.dto.EvolucionDTO;
import calidia.backend.dto.HistorialDTO;
import calidia.backend.dto.PaginacionDTO;
import calidia.backend.dto.mappers.EvolucionMapper;
import calidia.backend.dto.response.EvolucionResponseDTO;
import calidia.backend.servicio.EvolucionServicio;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evoluciones")
public class EvolucionControlador {

    private final EvolucionServicio evolucionServicio;

    public EvolucionControlador(EvolucionServicio evolucionServicio) {
        this.evolucionServicio = evolucionServicio;
    }

    @PostMapping
    public EvolucionResponseDTO registrar(@Valid @RequestBody EvolucionDTO dto) {
        return EvolucionMapper.toDTO(
                evolucionServicio.registrarEvolucion(dto)
        );
    }

    @GetMapping("/residente/{dni}")
    public List<EvolucionResponseDTO> historial(@PathVariable String dni, @RequestParam int page, @RequestParam int size) {
        return evolucionServicio.historialPorResidente(dni, page, size)
                .stream()
                .map(EvolucionMapper::toDTO)
                .toList();
    }

    @PostMapping("/residente/filtrado")
    public List<EvolucionResponseDTO> historialFiltrado(@Valid @RequestBody HistorialDTO dto, @RequestParam  int page, @RequestParam int size){
        return evolucionServicio.historialFiltrado(dto, page, size)
                .stream()
                .map(EvolucionMapper::toDTO)
                .toList();

    }
}

